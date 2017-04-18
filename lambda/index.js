var Alexa = require('alexa-sdk');

const OpearloAnalytics = require('opearlo-analytics');

const APP_ID = 'amzn1.ask.skill.4af154b7-b157-499d-aa15-16f4e2fb197d';

var attractions = require('./data/attractions');
var topFive = require('./data/topFive');

var states = {
  SEARCHMODE: '_SEARCHMODE',
  TOPFIVE: '_TOPFIVE',
};

var location = 'Harrow';

var welcomeMessage = `Guide to ${location}. You can ask me for an attraction, an overview of the area, or say help. What will it be?`;

var welcomeReprompt = 'You can ask me for an attraction, an overview of the area, or say help. What will it be?';

var HelpMessage = `Here are some things you can say: Give me an attraction. Tell me about ${location}. Tell me the top five things to do in ${location}. What would you like to do?`;

var moreInformation = 'See your  Alexa app for  more  information.';

var tryAgainMessage = 'please try again.';

var noAttractionErrorMessage = `There was an error finding this attraction, ${tryAgainMessage}`;

var topFiveMoreInfo = ' You can tell me a number for more information. For example open number one.';

var getMoreInfoRepromtMessage = 'What number attraction would you like to hear about?';

var getMoreInfoMessage = `OK, ${getMoreInfoRepromtMessage}`;

// var goodbyeMessage = `OK, have a nice time in ${location}.`;

var hearMoreMessage = `Would you like to hear about another top thing that you can do in ${location}?`;

var newline = '\n';

var output = '';

var alexa;


var topFiveIntro = `Here are the top five things to do in ${location}.`;

var newSessionHandlers = {
  'LaunchRequest': function () {
    this.handler.state = states.SEARCHMODE;
    output = welcomeMessage;
    this.emit(':ask', output, welcomeReprompt);
  },
  'getAttractionIntent': function () {
    this.handler.state = states.SEARCHMODE;
    this.emitWithState('getAttractionIntent');
  },
  'getTopFiveIntent': function () {
    this.handler.state = states.SEARCHMODE;
    this.emitWithState('getTopFiveIntent');
  },
  'AMAZON.StopIntent': function () {
    OpearloAnalytics.recordAnalytics(this.event.session.user.userId, 'Zs0SGzK38471yJ55tWPb75SQhOBYEJAj19kFBRQa', (result)=> {
      this.emit(':tell', 'Thanks for using my area guide. Goodbye!');
    });
  },
  'AMAZON.CancelIntent': function () {
    OpearloAnalytics.recordAnalytics(this.event.session.user.userId, 'Zs0SGzK38471yJ55tWPb75SQhOBYEJAj19kFBRQa', (result)=> {
      this.emit(':tell', 'Thanks for using my area guide. Goodbye!');
    });
  },
  'SessionEndedRequest': function () {
    // Use this function to clear up and save any data needed between sessions
    this.emit('AMAZON.StopIntent');
  },
  'Unhandled': function () {
    output = HelpMessage;
    this.emit(':ask', output, welcomeReprompt);
  },
};

var startSearchHandlers = Alexa.CreateStateHandler(states.SEARCHMODE, {
  'getOverview': function () {
    OpearloAnalytics.getVoiceContent('fNhbsp0HjDMH7AcLOsVnB0HvJiF3', 'Zs0SGzK38471yJ55tWPb75SQhOBYEJAj19kFBRQa', 'my-area', 'harrow-overview', (result) => {
      console.log('RESULT', result);
      this.emit(':ask', result, welcomeReprompt);
    });
      // output = locationOverview;
      // this.emit(':askWithCard', output, location, locationOverview);
  },
  'getAttractionIntent': function () {
    OpearloAnalytics.getVoiceContent('fNhbsp0HjDMH7AcLOsVnB0HvJiF3', 'Zs0SGzK38471yJ55tWPb75SQhOBYEJAj19kFBRQa', 'my-area', 'harrow-attractions', (result) => {
      console.log('RESULT', result);
      this.emit(':ask', result, welcomeReprompt);
    });
  },
  'getTopFiveIntent': function () {
    output = topFiveIntro;
    var cardTitle = `Top Five Things To See in ${location}`;

    for (var counter = topFive.length - 1; counter >= 0; counter--) {
      output += ` Number ${topFive[counter].number} : ${topFive[counter].caption} + ${newline}`;
    }
    output += topFiveMoreInfo;
    this.handler.state = states.TOPFIVE;
    this.emit(':askWithCard', output, topFiveMoreInfo, cardTitle, output);
  },
  'AMAZON.YesIntent': function () {
    output = HelpMessage;
    this.emit(':ask', output, HelpMessage);
  },
  'AMAZON.NoIntent': function () {
    output = HelpMessage;
    this.emit(':ask', HelpMessage, HelpMessage);
  },
  'AMAZON.StopIntent': function () {
    OpearloAnalytics.recordAnalytics(this.event.session.user.userId, 'Zs0SGzK38471yJ55tWPb75SQhOBYEJAj19kFBRQa', (result)=> {
      this.emit(':tell', 'Thanks for using my area guide. Goodbye!');
    });
  },
  'AMAZON.HelpIntent': function () {
    output = HelpMessage;
    this.emit(':ask', output, HelpMessage);
  },
  'AMAZON.RepeatIntent': function () {
    this.emit(':ask', output, HelpMessage);
  },
  'AMAZON.CancelIntent': function () {
    OpearloAnalytics.recordAnalytics(this.event.session.user.userId, 'Zs0SGzK38471yJ55tWPb75SQhOBYEJAj19kFBRQa', (result)=> {
      this.emit(':tell', 'Thanks for using my area guide. Goodbye!');
    });
  },
  'SessionEndedRequest': function () {
    OpearloAnalytics.recordAnalytics(this.event.session.user.userId, 'Zs0SGzK38471yJ55tWPb75SQhOBYEJAj19kFBRQa', (result)=> {
      this.emit(':tell', 'Thanks for using my area guide. Goodbye!');
    });
  },
  'Unhandled': function () {
    output = HelpMessage;
    this.emit(':ask', output, welcomeReprompt);
  },
});

var topFiveHandlers = Alexa.CreateStateHandler(states.TOPFIVE, {
  'getAttractionIntent': function () {
    this.handler.state = states.SEARCHMODE;
    this.emitWithState('getAttractionIntent');
  },
  'getOverview': function () {
    this.handler.state = states.SEARCHMODE;
    this.emitWithState('getOverview');
  },
  'getTopFiveIntent': function () {
    this.handler.state = states.SEARCHMODE;
    this.emitWithState('getTopFiveIntent');
  },
  'AMAZON.HelpIntent': function () {
    output = HelpMessage;
    this.emit(':ask', output, HelpMessage);
  },

  'getMoreInfoIntent': function () {
    var slotValue = this.event.request.intent.slots.attraction.value;
    var index = parseInt(slotValue) - 1;

    var selectedAttraction = topFive[index];
    if (selectedAttraction) {

      output = `${selectedAttraction.caption}. ${selectedAttraction.more}. ${hearMoreMessage}`;
      var cardTitle = selectedAttraction.name;
      var cardContent = selectedAttraction.caption + newline + newline + selectedAttraction.more + newline + newline + selectedAttraction.location + newline + newline + selectedAttraction.contact;

      this.emit(':askWithCard', output, hearMoreMessage, cardTitle, cardContent);
    }
    else {
      this.emit(':ask', noAttractionErrorMessage);
    }
  },

  'AMAZON.YesIntent': function () {
    output = getMoreInfoMessage;
    alexa.emit(':ask', output, getMoreInfoRepromtMessage);
  },
  'AMAZON.NoIntent': function () {
    OpearloAnalytics.recordAnalytics(this.event.session.user.userId, 'Zs0SGzK38471yJ55tWPb75SQhOBYEJAj19kFBRQa', (result)=> {
      this.emit(':tell', 'Thanks for using my area guide. Goodbye!');
    });
  },
  'AMAZON.StopIntent': function () {
    OpearloAnalytics.recordAnalytics(this.event.session.user.userId, 'Zs0SGzK38471yJ55tWPb75SQhOBYEJAj19kFBRQa', (result)=> {
      this.emit(':tell', 'Thanks for using my area guide. Goodbye!');
    });
  },
  'AMAZON.RepeatIntent': function () {
    this.emit(':ask', output, HelpMessage);
  },
  'AMAZON.CancelIntent': function () {
    OpearloAnalytics.recordAnalytics(this.event.session.user.userId, 'Zs0SGzK38471yJ55tWPb75SQhOBYEJAj19kFBRQa', (result)=> {
      this.emit(':tell', 'Thanks for using my area guide. Goodbye!');
    });
  },
  'SessionEndedRequest': function () {
    OpearloAnalytics.recordAnalytics(this.event.session.user.userId, 'Zs0SGzK38471yJ55tWPb75SQhOBYEJAj19kFBRQa', (result)=> {
      this.emit(':tell', 'Thanks for using my area guide. Goodbye!');
    });
  },

  'Unhandled': function () {
    output = HelpMessage;
    this.emit(':ask', output, welcomeReprompt);
  },
});

exports.handler = function (event, context, callback) {
  alexa = Alexa.handler(event, context);
  alexa.registerHandlers(newSessionHandlers, startSearchHandlers, topFiveHandlers);
  if (event.session.new) {
    OpearloAnalytics.initializeAnalytics('fNhbsp0HjDMH7AcLOsVnB0HvJiF3', 'my-area', event.session);
  }
  if (event.request.type === 'IntentRequest') {
    OpearloAnalytics.registerVoiceEvent(event.session.user.userId, 'IntentRequest', event.request.intent);
  }
  alexa.execute();
};


String.prototype.trunc =
  function (n) {
    return this.substr(0, n - 1) + (this.length > n ? '&hellip;' : '');
  };
