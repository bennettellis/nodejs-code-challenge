'use strict';

const DataPipeline = require('aws-sdk/clients/datapipeline');
const DMS = require('aws-sdk/clients/dms');

const dp = new DataPipeline({apiVersion: '2016-11-15'});
const dms = new DMS({apiVersion: '2016-11-15'});

/**
 * Lambda handler that loops through all DMS tasks that use as a target the Redshift endpoint specified (env)
 * and stops them. Then Runs the specified (env) Data Pipeline, and then restarts the DMS tasks it stopped.
 * @param event
 * @param context
 * @param callback
 * @returns {Promise<undefined | never>} uses callback to return results to Lambda
 */
exports.handler = (event, context, callback) => {

  console.info('Context', JSON.stringify(context));
  console.info('Event:', JSON.stringify(event));
  console.info('REDSHIFT_CLUSTER_ID:', JSON.stringify(process.env.REDSHIFT_CLUSTER_ID));
  console.info('DATA_PIPELINE:', JSON.stringify(process.env.DATA_PIPELINE));

  // check for valid env
  return Promise.resolve([process.env.REDSHIFT_CLUSTER_ID, process.env.DATA_PIPELINE])
    .then(([clusterId,pipeline]) => {
      if (!clusterId) {
        throw new Error("REDSHIFT_CLUSTER_ID environment variable is missing.");
      }
      if (!pipeline) {
        throw new Error("DATA_PIPELINE environment variable is missing.");
      }

      // find all DMS Endpints that use the specified Redshift instance
      console.log("Looking for DMS endpoints using cluster " + clusterId);
      return dms.describeEndpoints({MaxResults: 1000}).promise()
        .then(result => {
          // return all the redshift target endpoints that use this clusterId
          return result.Endpoints.reduce((acc, endpoint) => {
            if (endpoint.EndpointType === 'target' &&
              endpoint.EndpointName === 'redshift' &&
              endpoint.ServerName === clusterId) {
              return acc.concat(endpoint.EndpointArn);
            } else {
              return acc;
            }
          }, []);
        })
        .then(endpoints => {
          console.log(`Found ${endpoints.length} endpoints using the specified clusterId, checking for associated, running DMS tasks...`);
          // find all the DMS Task that utilize these endpoints
          const filters = endpoints.map(endpoint => {
            return {"Name": "endpoint-arn", "Value": endpoint};
          });

          return dms.describeReplicationTasks({Filters: filters}).promise();
        })
        .then(tasksToStop => {
          // stop all found DMS tasks that are running
          return Promise.all(tasksToStop.ReplicationTasks.map(replicatonTask => {
            return dms.stopReplicationTask({"ReplicationTaskArn": replicatonTask.ReplicationTaskArn}).promise();
          }));
        })
        .then(() => {
          // they're all stopped, now activate the Data Pipeline
          return dp.activatePipeline({"pipelineId": pipeline}).promise();
        })
        .then(() => {
          return dp.describePipelines({pipelineIds: [pipeline]}).promise();
        })
        .then(() => {
          return `DMS Tasks targeting ${clusterId} were stopped, and pipeline ${pipeline} started.`
        })
    })
    .then(result => {
      console.log(result);
      callback(null, result);
    })
    .catch(callback);
};

