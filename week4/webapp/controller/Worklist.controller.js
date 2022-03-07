sap.ui.define(
  [
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
  ],
  function (BaseController, JSONModel, formatter, Filter, FilterOperator) {
    "use strict";

    return BaseController.extend("week4.controller.Worklist", {
      formatter: formatter,

      _mFilters: {
        cheap: [new sap.ui.model.Filter("Price", "LT", 100)],
        moderate: [new sap.ui.model.Filter("Price", "BT", 100, 1000)],
        expensive: [new sap.ui.model.Filter("Price", "GT", 1000)],
      },

      /* =========================================================== */
      /* lifecycle methods                                           */
      /* =========================================================== */

      /**
       * Called when the worklist controller is instantiated.
       * @public
       */
      onInit: function () {
        var oViewModel;

        // keeps the search state
        this._aTableSearchState = [];

        // Model used to manipulate control states
        oViewModel = new JSONModel({
          worklistTableTitle:
            this.getResourceBundle().getText("worklistTableTitle"),
          shareSendEmailSubject: this.getResourceBundle().getText(
            "shareSendEmailWorklistSubject"
          ),
          shareSendEmailMessage: this.getResourceBundle().getText(
            "shareSendEmailWorklistMessage",
            [location.href]
          ),
          tableNoDataText: this.getResourceBundle().getText("tableNoDataText"),
          cheap: 0,
          moderate: 0,
          expensive: 0,
        });
        this.setModel(oViewModel, "worklistView");
      },

      /* =========================================================== */
      /* event handlers                                              */
      /* =========================================================== */

      /**
       * Triggered by the table's 'updateFinished' event: after new table
       * data is available, this handler method updates the table counter.
       * This should only happen if the update was successful, which is
       * why this handler is attached to 'updateFinished' and not to the
       * table's list binding's 'dataReceived' method.
       * @param {sap.ui.base.Event} oEvent the update finished event
       * @public
       */
      onUpdateFinished: function (oEvent) {
        // update the worklist's object counter after the table update
        var sTitle,
          oTable = oEvent.getSource(),
          oModel = this.getModel(),
          oViewModel = this.getModel("worklistView"),
          iTotalItems = oEvent.getParameter("total");
        // only update the counter if the length is final and
        // the table is not empty
        if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
          sTitle = this.getResourceBundle().getText("worklistTableTitleCount", [
            iTotalItems,
          ]);
          // iterate the filters and request the count from the server
          //   jQuery.each(this._mFilters, function (sFilterKey, oFilter) {
          //     oModel.read("/ProductSet/$count", {
          //       filters: oFilter,
          //       success: function (oData) {
          //         var sPath = "/" + sFilterKey;
          //         oViewModel.setProperty(sPath, oData);
          //       },
          //     });
          //   });
        } else {
          sTitle = this.getResourceBundle().getText("worklistTableTitle");
        }
        this.getModel("worklistView").setProperty(
          "/worklistTableTitle",
          sTitle
        );
      },

      /**
       * Event handler for press event on object identifier.
       * opens detail popover to show product dimensions.
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
       * Event handler when a table item gets pressed
       * @param {sap.ui.base.Event} oEvent the table selectionChange event
       * @public
       */
      onPress: function (oEvent) {
        // The source is the list item that got pressed
        this._showObject(oEvent.getSource());
      },

      /**
       * Event handler for navigating back.
       * Navigate back in the browser history
       * @public
       */
      onNavBack: function () {
        // eslint-disable-next-line sap-no-history-manipulation
        history.go(-1);
      },

      onSearch: function (oEvent) {
        if (oEvent.getParameters().refreshButtonPressed) {
          // Search field's 'refresh' button has been pressed.
          // This is visible if you select any main list item.
          // In this case no new search is triggered, we only
          // refresh the list binding.
          this.onRefresh();
        } else {
          var aTableSearchState = [];
          var sQuery = oEvent.getParameter("query");

          if (sQuery && sQuery.length > 0) {
            aTableSearchState = [
              new Filter("ProductID", FilterOperator.Contains, sQuery),
            ];
          }
          this._applySearch(aTableSearchState);
        }
      },

      /**
       * Event handler for refresh event. Keeps filter, sort
       * and group settings and refreshes the list binding.
       * @public
       */
      onRefresh: function () {
        var oTable = this.byId("table");
        oTable.getBinding("items").refresh();
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
       * Shows the selected item on the object page
       * @param {sap.m.ObjectListItem} oItem selected Item
       * @private
       */
      _showObject: function (oItem) {
        this.getRouter().navTo("object", {
          objectId: oItem
            .getBindingContext()
            .getPath()
            .substring("/ProductSet".length),
        });
      },

      /**
       * Internal helper method to apply both filter and search state together on the list binding
       * @param {sap.ui.model.Filter[]} aTableSearchState An array of filters for the search
       * @private
       */
      _applySearch: function (aTableSearchState) {
        var oTable = this.byId("table"),
          oViewModel = this.getModel("worklistView");
        oTable.getBinding("items").filter(aTableSearchState, "Application");
        // changes the noDataText of the list in case there are no filter results
        if (aTableSearchState.length !== 0) {
          oViewModel.setProperty(
            "/tableNoDataText",
            this.getResourceBundle().getText("worklistNoDataWithSearchText")
          );
        }
      },
    });
  }
);
