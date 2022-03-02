sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "opensap/myapp/model/formatter",
  ],
  function (Controller, MessageToast, Filter, FilterOperator, formatter) {
    "use strict";
    //appname: opensap.myapp
    //name of the folder: controller
    //name of the artifact: APP
    return Controller.extend("opensap.myapp.controller.App", {
      formatter: formatter,
      onShowHello: function () {
        // read msg from i18n model
        let oBundle = this.getView().getModel("i18n").getResourceBundle();
        let sRecipient = this.getView()
          .getModel("helloPanel")
          .getProperty("/recipient/name");
        let sMsg = oBundle.getText("helloMsg", [sRecipient]);
        MessageToast.show(sMsg);
      },
      onFilterProducts: function (oEvent) {
        // build filter array
        var aFilter = [],
          sQuery = oEvent.getParameter("query"),
          // retrieve list control
          oList = this.getView().byId("productsList"),
          // get binding for aggregation 'items'
          oBinding = oList.getBinding("items");
        if (sQuery) {
          aFilter.push(
            new Filter("ProductID", FilterOperator.Contains, sQuery)
          );
        }
        // apply filter. an empty filter array simply removes the filter
        // which will make all entries visible again
        oBinding.filter(aFilter);
      },
      onItemSelected: function (oEvent) {
        let oSelectedItem = oEvent.getSource();
        let oContext = oSelectedItem.getBindingContext();
        let sPath = oContext.getPath();
        let oProductDetailPanel = this.byId("productDetailsPanel");
        oProductDetailPanel.bindElement({ path: sPath });
        this.byId("productDetailsPanel").setVisible(true);
      },
    });
  }
);
