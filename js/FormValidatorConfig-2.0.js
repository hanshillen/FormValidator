/**
 * @fileOverview Contains configuration parameters and a default ruleset for the FormValidator class
 * @version 1.6b
 */

if (!TPG) {
	/**
	 * @namespace Global namespace for TPG related classes (such as FormValidator) and other relevant properties
	 */
	var TPG = {};
}

// the private variables below may be modified  

/** Object containing Localized strings, where each key is a locale code, and each value is a nested object containing the individual string ids and their localized translation
 * Localized strings may use %s as place holders for parameters.
 * Note that these strings should only be used for fixed language used by this class, strings related to the actual rules should be localized by overwriting them,
 * e.g. using setRule(), updateRuleInvalidHTML(), and updateRuleValidHTML()    
 * The current locale is determined by the static variable FormValidator.currentLocale. Changing it will change the local for all FormValidator instances on the page.
 * If FormValidator.currentLocale is set to a local that is not defined here, it will default to en_us
 * Note: TPG can add more locales as needed. As the FormValidator class evolves, additional strings may be added to each locale.
 * @type object
 */
TPG.validatorLocalizedStrings = {
	en_us : {
		summaryHeadingSingle : "Your information contains 1 error",
		summaryHeadingPlural : "Your information contains %s errors",
		//errorPrefix : "<span class='iconCustom-exclamation-sign' aria-hidden='true'></span><span class='HiddenText'> </span>Important: ",
		errorPrefix : "<span class='glyphicon' aria-hidden='true'>&#xe101;</span><span class='sr-only'>Problem: </span> ",
		errorSeparator : ": ",
		successPrefix : "Success: ",
		waitingForValidation : "Validating..."
	},
	es : { // From Google Translate,  replace these with correct Spanish
		summaryHeadingSingle : "Su informacion contiene 1 error",
		summaryHeadingPlural : "Su informacion contiene %s errores",
		//errorPrefix : "<span class='iconCustom-exclamation-sign' aria-hidden='true'></span><span class='HiddenText'> </span>Importante: ",
		errorPrefix : "<span style='font-family: FontAwesome; font-size: 16px;' class='FontAwesome' aria-hidden='true'>&#xf06a;</span> Importante: ",
		errorSeparator : " ",
		successPrefix : "Acierto: ",
		waitingForValidation : "Estoy Validacion..."
	}
};

/**
 * How long to wait for asynchronous validation callbacks before they timeout
 * When the timeout is reached before the callback returns, the "please wait..." indicatsor is removed
 * @type number
 */
TPG.validatorAsyncTimeoutDuration = 3000; 

TPG.validatorHTMLStrings = {
		summaryHeading: "<h4><span class='glyphicon' aria-hidden='true'>&#xe101;</span><span class='sr-only'>Problem: </span> </h4>",
		summarycontainer: "<div></div>",
		summaryList: "<ul></ul>",
		summaryListItem: "<li></li>",
		summaryListLink: "<a></a>",
		inlineFeedbackItem: "<span></span>"
};


/**
 * Optional custom logic to determine after which element to place the inline error message.
 * Use this for situations where the default logic (after field itself, after form hint, after fieldset legend, after custom checkbox) is not sufficient
 * @param $field
 * @return The element after which the error message should be placed. Return null if not used
 */
TPG.customLogicForElementToFollow = function($field) {
	//check for use of custom inputs as used by Filament Group's custominput.js:
	if ($field.parent().is(".custom-checkbox, .custom-radio")) {
		return $field.parent();
	} else if ($field.next().is(".date-picker-control")) {
		return $field.nextAll(".supportText, .date-picker-control").last();
	}
	return null;
};

/** Object containing default set of validator rules.
 * Each rule is identified by a ruleId as key, and a two or three item array as value. The array must be populated as follows: 
 * [0] (required) : The validation logic. Can be either a regular expression (both strings and actual RegEx instances are accepted ) or a callback (see updateRuleLogic() for more info).
 * [1] (required) : The error message HTML string to be displayed when the rule is not matched.
 * [2] (optional) : The success message HTML string to be displayed when the rule is matched. 
 * NOTE: a third index may be used by the script to store rule arguments for the rule's callback. 
 * These arguments can be specified as dash separated values to the ruleID in the data-validate attribute, e.g. checkboxGroupRange-1-5 
 * These default rules (or their parts) can be overwritten by individual teams through setRules(), setRule(), updateRuleLogic(), updateRuleInvalidHTML(), and  updateRuleValidHTML()
 * NOTE: A field can only have ONE rule that uses an asynchronous callback and/or a success message, and this rule MUST be the last ruleId in the field's data-validate property
 * NOTE: TPG teams should add, remove or modify these default rules where applicable
 * @type Object 
 */
TPG.defaultValidatorRules = {
	EIN: ["^\\d{9}|\\d{2}-\\d{7}$", "EIN not valid"],
	email: ["^[_A-Za-z0-9-]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$", "This is not a valid email address"],
	supplierNameRule: ["^[a-zA-Z0-9 '-\\.]{1,30}$", "Please enter a valid supplier name to proceed with your search"],
	manufacturerNameRule: ["^[a-zA-Z0-9 '-\\.]{1,30}$", "Please enter a valid manufacturer name to proceed with your search"],
	brandNameRule: ["^[a-zA-Z0-9 '-\\.]{1,30}$", "Please enter a valid brand name to proceed with your search"],
	firstName: ["^[a-zA-Z '-]{2,30}$", "Your first name must be between 2 and 30 characters"],
	issuerMarketCoverage: ["^Individual|SHOP|Both$", "You must choose between 'individual, 'SHOP', or 'both'"],
	lastName: ["^[a-zA-Z '-]{2,30}$", "Your last name must be between 2 and 30 characters"],
	marketType: ["^Commercial|Exchange|Medicaid$", "You must choose between 'individual, 'SHOP', or 'both'"],
	middleName: ["^[a-zA-Z '-]{2,30}$", "Your middle name must be between 2 and 30 characters"],
	naicCompanyCode: ["^\\d{6}$", "Your company code must be six digits"],
	naicGroupCode: ["^\\d{6}$", "Your group code must be six digits"],
	ncqaAccreditationStatus: ["^Excellent|Commendable|Accredited|Provisional|Interim|In Process|Scheduled$", "This is not a valid option"],
	ncqaOrganizationId: ["^[a-zA-Z0-9]{2,5}$", "This is not a valid organization ID"],
	networkId: ["\\d{5}", "Your network ID must be 5 digits"],
	notBlank: ["^(?!\\s*$).+", "This field is required"],
	phoneNumber: ["(1-\\d{3}-\\d{3}-\\d{4})|(\\d{3}-\\d{3}-\\d{4})|(1\\d{10})|(\\d{10})", " This is not a valid phone number"],
	phoneNumberExtn: ["(^$)|\\d|\\d{2}|\\d{3}|\\d{4}|\\d{5}|\\d{6}|\\d{7}|\\d{8}|\\d{9}|\\d{10}", "This is not a valid phone extension"],
	productType: ["^PPO Only|HMO Only|POS Only|HMO/POS Combined|PPO/POS Combined|HMO/POS/PPO Combined$", "This is not a valid product type"],
	state: ["^[A-Z]{2}$", "This is not a valid state code"],
	state51: ["^AK|AL|AR|AZ|CA|CO|CT|CZ|DC|DE|FL|GA|HI|IA|ID|IL|IN|KS|KY|LA|MA|MD|ME|MI|MN|MO|MS|MT|NE|NC|ND|NH|NJ|NM|NY|NV|OH|OK|OR|PA|PR|RI|SC|SD|TN|TX|UT|VA|VI|VT|WA|WI|WV|WY$", "Please choose a state"],
	statusCode: ["\\d|\\d{2}", "This is not a valid state"],
	tIN: ["^\\d{9}|\\d{2}-\\d{7}$", "TIN invalid"],
	title: ["^[a-zA-Z\\.]{1,6}$", "This is not a valid title"],
	uracAccreditationStatus: ["^Full|Conditional|Provisional$", "You must choose between 'Full, 'Conditional' or 'provisional'"],
	uracApplicationNumber: ["^[a-zA-Z0-9]{9,10}$", "this is not a valid application number"],
	uRL: ["^(http(s?)\\:\\/\\/)?(www\\.)?[\\w\\-\\.]+\\.[a-zA-Z]{2,3}\\/*[\\w\\-\\/\\.]*$", "The URL you entered is invalid"],
	zipCode: ["^\\d{5}$", "Please enter a 5 digit numeric value in the location field."],
	date: ["^(0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.](19|20)\d\d$", "This is not a valid date"],
	moreThanOneCharacter: [function(value) {
		return (value.length != 1);
	}, "Please enter at least two characters."],
	checked : ["^checked$", "You must check this box before you can continue"],
	"checkboxGroupRange" : [function(value, $group, args){
		var $checkedBoxes = $group.find("input[type=checkbox]:checked");
		var result = $checkedBoxes.length >= args[0] && $checkedBoxes.length <= args[1] ? true : false;
		return {
			result : result, 
			params : [args[0], args[1]]
		};
	}, "You must select between %s and %s items"],
	"checkboxGroupMinimum" : [function(value, $group, args){
		var $checkedBoxes = $group.find("input[type=checkbox]:checked");
		var result = $checkedBoxes.length >= args[0] ? true : false;
		return {
			result : result, 
			params : [args[0]]
		};
	}, "Please select at least %s item(s)"],
	"checkboxGroupMaximum" : [function(value, $group, args){
		var $checkedBoxes = $group.find("input[type=checkbox]:checked");
		var result = $checkedBoxes.length <= args[0] ? true : false;
		return {
			result : result, 
			params : [args[0]]
		};
	}, "Please select no more than %s item(s)"]
};