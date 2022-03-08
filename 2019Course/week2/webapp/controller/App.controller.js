sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/m/MessageToast"],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, MessageToast) {
    "use strict";

    return Controller.extend("week2.controller.App", {
      onInit: function () {
        console.log("On init");
      },
      onBeforeRendering: function () {
        console.log("The view will shortly be rendered.");
      },
      onAfterRendering: function () {
        console.log("The view has been rendered.");
      },
      onExit: function () {
        console.log("Controller will shortly be destroyed.");
      },

      onPress: function (oMessage) {
        MessageToast.show("Searching..." + oMessage);
      },
    });
  }
);
