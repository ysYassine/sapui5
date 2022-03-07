sap.ui.define(
  ["sap/ui/core/mvc/Controller", "../model/formatter"],
  function (Controller, formatter) {
    "use strict";
    return Controller.extend("week4.controller.ProductDetails", {
      formatter: formatter,
      onInit: function () {
        this.byId("categoryLabel").setVisible(false);
        this.byId("category").setVisible(false);
      },
    });
  }
);
