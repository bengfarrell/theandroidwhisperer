app.service('state', function() {
    var self = this;

    /** state history */
    this.stateHistory = [];

    /** current state */
    this.currentState = "none";

    /**
     * attach the state object for this controller and start watching
     * @param scope
     */
    this.attachController = function(scope) {
        scope.state = self;
    }

    /**
     * set our current state
     * @param state
     */
    this.setState = function(scope, state) {
        // todo: offer state management per scope
        self.stateHistory.push(self.currentState);
        self.currentState = state;
        return self.currentState;
    }


    /**
     * add substate to current state
     * @param scope
     * @param substate
     * @returns {*}
     */
    this.addSubState = function(scope, substate) {
        self.stateHistory.push(self.currentState);
        self.currentState = state + "." + substate;
        return self.currentState;
    }

    /**
     * remove last substate from scope
     * @param scope
     */
    this.removeSubState = function(scope) {
        self.stateHistory.push(self.currentState);
        var sts = self.currentState.split(".");
        sts.pop();
        self.currentState = sts.join(".");
    }

    /**
     * get our current state
     * @param state
     */
    this.getState = function(scope) {
        return self.currentState;
    }

    /**
     * undo to last state
     * @returns {*|pop|Mixed|Suite.pop}
     */
    this.undoState = function(scope) {
        self.currentState = self.stateHistory.pop();
        return self.currentState;
    }
});