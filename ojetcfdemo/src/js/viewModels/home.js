define(['ojs/ojcore', 'knockout', 'jquery',
        'ojs/ojknockout', 'ojs/ojlabel', 'ojs/ojprogress', 'ojs/ojinputtext',
        'ojs/ojformlayout', 'ojs/ojdatetimepicker', 'ojs/ojradioset', 'promise'],
 function(oj, ko, $) {

    function HomeViewModel() {
      var self = this;

      // Input
      self.name = ko.observable("");
      self.surname = ko.observable("");
      self.gender = ko.observable("");
      self.birthdate = ko.observable("");
      self.day = ko.observable("");
      self.month = ko.observable("");
      self.year = ko.observable("");
      self.town = ko.observable("");

      // Output
      self.cf = ko.observable("");

      // Loading icon
      self.progressValue = ko.observable(-1);
      self.dataLoaded = ko.observable(false);

      self.isSmall = oj.ResponsiveKnockoutUtils.createMediaQueryObservable(
                     oj.ResponsiveUtils.getFrameworkQuery(oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY));
                     // For small screens: labels on top
                     // For medium or bigger: labels inline
                     self.labelEdge = ko.computed(function() {
                       return self.isSmall() ? "top" : "start";
                     }, self);

      self.buttonClick = function(event) {
                          self.dataLoaded(true);
                          alert();
                          var parsedDate = self.birthdate().split("-");
                          self.year(parsedDate[0]);
                          self.month(parsedDate[1]);
                          self.day(parsedDate[2]);

                          var payload = {
                            name: self.name(),
                            surname: self.surname(),
                            gender: self.gender(),
                            day: self.day(),
                            month: self.month(),
                            year: self.year(),
                            town: self.town().toUpperCase()
                          };

                          $.ajax({
                            url: "http://localhost:8080/r/codicefiscale/cf",
                            method: 'POST',
                            data: JSON.stringify(payload),
                            contentType: 'application/json',
                            success: function(data) {
                                          self.dataLoaded(false);
                                          self.cf(data.message);
                                     }
                           });
                          return true;
                        }

      // Below are a set of the ViewModel methods invoked by the oj-module component.
      // Please reference the oj-module jsDoc for additional information.

      /**
       * Optional ViewModel method invoked after the View is inserted into the
       * document DOM.  The application can put logic that requires the DOM being
       * attached here.
       * This method might be called multiple times - after the View is created
       * and inserted into the DOM and after the View is reconnected
       * after being disconnected.
       */
      self.connected = function() {
        // Implement if needed
      };

      /**
       * Optional ViewModel method invoked after the View is disconnected from the DOM.
       */
      self.disconnected = function() {
        // Implement if needed
      };

      /**
       * Optional ViewModel method invoked after transition to the new View is complete.
       * That includes any possible animation between the old and the new View.
       */
      self.transitionCompleted = function() {
        // Implement if needed
      };
    }

    /*
     * Returns a constructor for the ViewModel so that the ViewModel is constructed
     * each time the view is displayed.  Return an instance of the ViewModel if
     * only one instance of the ViewModel is needed.
     */
    return new HomeViewModel();
  }
);
