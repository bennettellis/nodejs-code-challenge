'use strict';

const assert = require('assert');
const OrderFormatter = require('./order-converter');

describe('OrderFormatter', function () {
  describe('formatOrderItems', function () {
    const formatter = new OrderFormatter();

    it('should return [] if orderData is not present', function () {
      const result = formatter.reformatOrderItems();
      assert.deepEqual(result, []);
    });

    it('should return reformatted array from object representing one order', function () {
      const testOrders = {
        hat: {
          quantity: 1,
          price: 3
        }
      };
      const result = formatter.reformatOrderItems(testOrders);
      assert.deepEqual(result, [
          {
            item: "hat",
            quantity: 1,
            price: 3,
            revenue: 3
          }
        ]
      );
    });

    it('should return reformatted array from object representing more than one order', function () {
      const testOrders = {
        hat: {
          quantity: 1,
          price: 3
        },
        dog: {
          quantity: 2,
          price: 350
        }
      };
      const result = formatter.reformatOrderItems(testOrders);
      assert.deepEqual(result, [
          {
            item: "hat",
            quantity: 1,
            price: 3,
            revenue: 3
          },
          {
            item: "dog",
            quantity: 2,
            price: 350,
            revenue: 700
          }
        ]
      );
    });

    it('should throw error if quantity missing', function () {
      const testOrders = {
        hat: {
          price: 3
        }
      };
      assert.throws(() => {
        return formatter.reformatOrderItems(testOrders);
      }, Error, "Error thrown");
    });

    it('should throw error if price missing', function () {
      const testOrders = {
        hat: {
          quantity: 3
        }
      };
      assert.throws(() => {
        return formatter.reformatOrderItems(testOrders);
      }, Error, "Error thrown");
    });

    it('should throw error if quantity is not a number', function () {
      const testOrders = {
        hat: {
          quantity: "someeval"
        }
      };
      assert.throws(() => {
        return formatter.reformatOrderItems(testOrders);
      }, Error, "Error thrown");
    });

    it('should throw error if price is not a number', function () {
      const testOrders = {
        hat: {
          price: "someeval"
        }
      };
      assert.throws(() => {
        return formatter.reformatOrderItems(testOrders);
      }, Error, "Error thrown");
    });
  });

  describe('formatOrder', function () {
    const formatter = new OrderFormatter();

    it('should return properly reformatted order if complete order passed', function () {
      const testOrder = {
        id: 1,
        vendor: 'Foo Inc',
        date: '1997-01-01',
        customer: {id: "CUSTID1"},
        order: {
          hat: {
            quantity: 1,
            price: 3
          },
        }
      };
      const result = formatter.reformatOrder(testOrder);
      assert.deepEqual(result, {
          id: 1,
          vendor: 'Foo Inc',
          date: '1997-01-01',
          customerId: "CUSTID1",
          order: [
            {
              item: "hat",
              quantity: 1,
              price: 3,
              revenue: 3
            }

          ]
        }
      );
    });

    it('should return properly reformatted order if complete order passed even if order has no items', function () {
      const testOrder = {
        id: 1,
        vendor: 'Foo Inc',
        date: '1997-01-01',
        customer: {id: "CUSTID1"},
        order: {}
      };
      const result = formatter.reformatOrder(testOrder);
      assert.deepEqual(result, {
          id: 1,
          vendor: 'Foo Inc',
          date: '1997-01-01',
          customerId: "CUSTID1",
          order: []
        }
      );
    });

    it('should throw error if no order passed', function () {
      assert.throws(formatter.reformatOrder, Error, "Error thrown");
    });

    it('should throw error if order passed has no vendor information', function () {
      const testOrder = {
        id: 1,
        date: '1997-01-01',
        customer: {id: "CUSTID1"},
        order: {}
      };
      assert.throws(() => {
        return formatter.reformatOrder(testOrder);
      }, Error, "Error thrown");
    });

    it('should throw error if order passed has no customer id information', function () {
      const testOrder = {
        id: 1,
        date: '1997-01-01',
        vendor: 'Foo Inc',
        order: {}
      };
      assert.throws(() => {
        return formatter.reformatOrder(testOrder);
      }, Error, "Error thrown");
    });

    it('should throw error if order passed has no customer id information', function () {
      const testOrder = {
        id: 1,
        date: '1997-01-01',
        vendor: 'Foo Inc',
        customer: {},
        order: {}
      };
      assert.throws(() => {
        return formatter.reformatOrder(testOrder);
      }, Error, "Error thrown");
    });

    it('should throw error if order passed has no id information', function () {
      const testOrder = {
        date: '1997-01-01',
        vendor: 'Foo Inc',
        customer: {id: "CUSTID1"},
        order: {}
      };
      assert.throws(() => {
        return formatter.reformatOrder(testOrder);
      }, Error, "Error thrown");
    });

    it('should throw error if order passed has no date information', function () {
      const testOrder = {
        id: 1,
        vendor: 'Foo Inc',
        customer: {id: "CUSTID1"},
        order: {}
      };
      assert.throws(() => {
        return formatter.reformatOrder(testOrder);
      }, Error, "Error thrown");
    });

  });
});
