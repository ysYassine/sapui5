sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "opensap/myapp/model/formatter",
  ],
  function (Controller, MessageToast, formatter) {
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
        // show message
        MessageToast.show(sMsg);
        // MessageToast.show(
        //   "Hello World"
        //   // {
        //   //   duration: 3000, // default
        //   //   width: "15em", // default
        //   //   my: "center bottom", // default
        //   //   at: "center bottom", // default
        //   //   of: window, // default
        //   //   offset: "0 0", // default
        //   //   collision: "fit fit", // default
        //   //   onClose: null, // default
        //   //   autoClose: true, // default
        //   //   animationTimingFunction: "ease", // default
        //   //   animationDuration: 1000, // default
        //   //   closeOnBrowserNavigation: true, // default
        //   // }
        // );
      },
    });
  }
);
