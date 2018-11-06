'use strict';

/**
 * Creates a new OrderFormatter that can be used to convert orders from old to new format
 * @constructor
 */
function OrderFormatter() {
  /**
   * Returns supplied orderData in new format
   * @param orderData order data in old format
   * @returns {{id: number, vendor: string, date: string, customerId: string, order: *[]}} the order in the new format
   * @throws Error if orderData is not supplied
   */
  this.reformatOrder = (orderData) => {
    if (!orderData) {
      throw new Error("reformatOrder expects orderData parameter.")
    }
    if(!orderData.id) {
      throw new Error(`Order ${JSON.stringify(orderedData)} is missing the id attribute`);
    }
    if(!orderData.vendor) {
      throw new Error(`Order ${JSON.stringify(orderedData)} is missing the vendor attribute`);
    }
    if(!orderData.date) {
      throw new Error(`Order ${JSON.stringify(orderedData)} is missing the date attribute`);
    }
    if(!orderData.customer || !orderData.customer.id) {
      throw new Error(`Order ${JSON.stringify(orderedData)} is has missing or invalid cutomer information`);
    }
    return {
      id: orderData.id,
      vendor: orderData.vendor,
      date: orderData.date,
      customerId: orderData.customer.id,
      order: this.reformatOrderItems(orderData.order)
    }
  };

  /**
   * Returns order items in new format.
   * @param orderedItems object whose keys are order items (old format), for example, {"item1": { "quantity": 14, "price": 8 }, "item2": { "quantity": 2, "price": 12} }
   * @returns [] array of converted orders, for example [{ "item": "item1", "quantity": 14, "price": 8, "revenue": 112 }...]. If orderItems is not specified returns []
   * @throws Error if orderedItems contains invalid items that don't conform to required structure
   */
  this.reformatOrderItems = (orderedItems) => {
    if (!orderedItems) {
      return [];
    }
    return Object.keys(orderedItems).map((item) => {
      const itemDetails = orderedItems[item];
      if(!itemDetails){
        throw new Error(`order identified by ${item} is not a valid order`);
      }
      if(!itemDetails.quantity || isNaN(itemDetails.quantity)) {
        throw new Error(`order identified by ${item} has invalid quantity "${itemDetails.quantity}"`);
      }
      if(!itemDetails.price || isNaN(itemDetails.price)) {
        throw new Error(`order identified by ${item} has invalid price "${itemDetails.price}"`);
      }
      return {
        item: item,
        quantity: itemDetails.quantity,
        price: itemDetails.price,
        revenue: itemDetails.price * itemDetails.quantity
      };
    });
  };
}

module.exports = OrderFormatter;