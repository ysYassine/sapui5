sap.ui.define(
  [
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/routing/History",
    "../model/formatter",
    "sap/m/MessageToast",
  ],
  function (BaseController, JSONModel, History, formatter, MessageToast) {
    "use strict";

    return BaseController.extend("week4.controller.Object", {
      formatter: formatter,

      /* =========================================================== */
      /* lifecycle methods                                           */
      /* =========================================================== */

      /**
       * Called when the worklist controller is instantiated.
       * @public
       */
      onInit: function () {
        // Model used to manipulate control states. The chosen values make sure,
        // detail page shows busy indication immediately so there is no break in
        // between the busy indication for loading the view's meta data
        var oViewModel = new JSONModel({
          busy: true,
          delay: 0,
        });
        this.getRouter()
          .getRoute("object")
          .attachPatternMatched(this._onObjectMatched, this);
        this.setModel(oViewModel, "objectView");
      },
      /* =========================================================== */
      /* event handlers                                              */
      /* =========================================================== */
      onRatingChanged: function (oEvent) {
        var iValue = oEvent.getParameter("value"),
          sMessage = this.getResourceBundle().getText("productRatingSuccess", [
            iValue,
          ]);
        MessageToast.show(sMessage);
      },
      /**
       * Event handler for press event on object identifier.
       * opens detail popup from component to show product dimensions.
       * @public
       */
      onShowDetailPopover: function (oEvent) {
        var oPopover = this._getPopover();
        var oSource = oEvent.getSource();
        oPopover.bindElement(oSource.getBindingContext().getPath());
        // open dialog
        oPopover.openBy(oEvent.getParameter("domRef"));
      },
      /**
       * Event handler  for navigating back.
       * It there is a history entry we go one step back in the browser history
       * If not, it will replace the current entry of the browser history with the worklist route.
       * @public
       */
      onNavBack: function () {
        var sPreviousHash = History.getInstance().getPreviousHash();
        if (sPreviousHash !== undefined) {
          // eslint-disable-next-line sap-no-history-manipulation
          history.go(-1);
        } else {
          this.getRouter().navTo("worklist", {}, true);
        }
      },

      /* =========================================================== */
      /* internal methods                                            */
      /* =========================================================== */
      _getPopover: function () {
        // create dialog lazily
        if (!this._oPopover) {
          // create popover via fragment factory
          this._oPopover = sap.ui.xmlfragment(
            "week4.view.ResponsivePopover",
            this
          );
          this.getView().addDependent(this._oPopover);
        }
        return this._oPopover;
      },

      /**
       * Binds the view to the object path.
       * @function
       * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
       * @private
       */
      _onObjectMatched: function (oEvent) {
        var sObjectId = oEvent.getParameter("arguments").objectId;
        this._bindView("/ProductSet" + sObjectId);
      },

      /**
       * Binds the view to the object path.
       * @function
       * @param {string} sObjectPath path to the object to be bound
       * @private
       */
      _bindView: function (sObjectPath) {
        var oViewModel = this.getModel("objectView");

        this.getView().bindElement({
          path: sObjectPath,
          parameters: {
            expand: "ToSupplier",
          },
          events: {
            change: this._onBindingChange.bind(this),
            dataRequested: function () {
              oViewModel.setProperty("/busy", true);
            },
            dataReceived: function () {
              oViewModel.setProperty("/busy", false);
            },
          },
        });
      },

      _onBindingChange: function () {
        var oView = this.getView(),
          oViewModel = this.getModel("objectView"),
          oElementBinding = oView.getElementBinding();

        // No data for the binding
        if (!oElementBinding.getBoundContext()) {
          this.getRouter().getTargets().display("objectNotFound");
          return;
        }

        var oResourceBundle = this.getResourceBundle(),
          oObject = oView.getBindingContext().getObject(),
          sObjectId = oObject.ProductID,
          sObjectName = oObject.ProductSet;

        oViewModel.setProperty("/busy", false);
        oViewModel.setProperty(
          "/shareSendEmailSubject",
          oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId])
        );
        oViewModel.setProperty(
          "/shareSendEmailMessage",
          oResourceBundle.getText("shareSendEmailObjectMessage", [
            sObjectName,
            sObjectId,
            location.href,
          ])
        );
      },
    });
  }
);
