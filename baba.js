/**
 * Created by HenShuk on 23/06/2016.
 */

// import packages
var request = require('request');
require( "console-stamp" )( console, { pattern : "dd/mm/yyyy HH:MM:ss.l" } );

// Static vars
var debug = false;
var printParametersInExtractionFunction = false;

// Initialize parameters
// For parameter name com.salesforce.visualforce.ViewState
var viewState = '';
// For parameter name com.salesforce.visualforce.ViewStateCSRF
var viewStateCsrf = '';
// For parameter name com.salesforce.visualforce.ViewStateMAC
var viewStateMac = '';
// For parameter name com.salesforce.visualforce.ViewStateVersion
var viewStateVersion = '';



// Start
console.info('Initializing request...');

// Imperva Portal credentials
var impervaUsername = 'talt-csp@imperva.com';
var impervaPassword = '12qwaszx';

// Extract raw data from portal
getRawDataFromImpPortal();

function getRawDataFromImpPortal() {
    // Call login function
    postImpLogin();
}


function postImpLogin() {
// ************************ First step: Login to site with POST ************************
// First request - Configure headers for POST request
    var headers = {

        'User-Agent': 'user-agent:Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) ' +
        'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36',

        'Content-Type': 'application/x-www-form-urlencoded'
    };

// First request - Configure body for POST request. Contains login credentials
    var postBody = {
        'Customer.retUrl': '',
        'Customer.CustomerUsername': impervaUsername,
        'Customer.CustomerPassword': impervaPassword
    };

// First request - Build the POST request
    var options = {
        // Handle redirects 304, 302 automatically
        followAllRedirects: true,
        // Handle cookie automatically
        jar: true,
        url: 'https://www.imperva.com/Login/CustomerLogin',
        method: 'POST',
        headers: headers,
        form: postBody
    };

// First request - Execute POST login request
    console.info('About to execute POST login request with credentials');

    request(options, function (error, response, body) {
        console.info('Trying to login: https://www.imperva.com/Login/CustomerLogin');

        if ((response.statusCode == 200) || (response.statusCode == 302) || (response.statusCode == 304)) {
            console.info('POST login returned response code: ' + response.statusCode);

            // Catch cookie for future executions
            //catchSetCookie = response.headers['set-cookie'];

            // console.info('Print catchCookie value:\n' + catchSetCookie);
            //console.info(body);

            // Extract href for redirect
            var href = extractHrefFromLoginRedirect(body);
            console.info('Found href: ' + href);

            //getPage(catchSetCookie);
            //var catchResponse = response.headers.includes('set-cookie');
            //catchCookie = catchResponse.replace('(.*)(\'set-cookie\': [ \')()', '$2');

            if (debug == true){
                console.info('Print response:\n');
                console.info(response);
                console.info('Print body:\n');
                console.info(body);
            }

			if (href == ''){
				console.info('Calling GET request to Imperva main portal page: https://imperva.my.salesforce.com/home/home.jsp');
				getImpMainPortalPage();
			}
			else{
				console.info('Calling GET request to href: ' + href);
				getHrefPage(href);
			}

        }
        else {
            console.warn('Encountered unexpected response code. ');
            console.warn('Response code: ' + response.statusCode);
            if (debug == true) {
                console.info('Print response:\n');
                console.info(response);
            }
        }
    });
}
// ******************************** End of POST login request *********************************


function extractHrefFromLoginRedirect(body) {
    var start = body.search((/(If the redirect does not occur within a few seconds, please click <a href=")/));
    var end = body.search((/>here<\/a>\./));
    var substringOfBody = body.slice(start,end);

//    start = temp.search(/(https)/);


    substringOfBody = substringOfBody.replace(/(.*If the redirect.*)(https.*URL=)(".*)/g, "$2");
    return substringOfBody;
}


function getHrefPage(href) {

// Second request - Build the GET request
    var options = {
        jar: true,
        followAllRedirects: true,
        url: href,
        method: 'GET',
        headers: ''
    };

// Second request - Execute GET request for href
    request(options, function (error, response, body) {
        console.info('Trying to connect: ' + href);

        if ((response.statusCode == 200) || (response.statusCode == 302) || (response.statusCode == 304)) {
            console.info('GET request for href returned response code: ' + response.statusCode);

            if (debug == true) {
                console.info('Print response:\n');
                console.info(response);
                console.info('Print body:\n');
                console.info(body);
            }

            console.info('Calling GET request to Imperva main portal page: https://imperva.my.salesforce.com/home/home.jsp');
            getImpMainPortalPage();
        }
        else {
            console.warn('Encountered unexpected response code. ');
            console.warn('Response code: ' + response.statusCode);
            if (debug == true) {
                console.info('Print response:\n');
                console.info(response);
            }
        }
    });
}


function getImpMainPortalPage() {

// Second request - Build the GET request for IMP main portal page
    var options = {
        jar: true,
        followAllRedirects: true,
        url: 'https://imperva.my.salesforce.com/home/home.jsp',
        method: 'GET',
        headers: ''
    };

// Second request - Execute GET to IMP main portal page
    console.info( 'About to execute GET request for Imperva main portal page');

    request(options, function (error, response, body) {
        console.info('Trying to connect: https://imperva.my.salesforce.com/home/home.jsp');

        if ((response.statusCode == 200) || (response.statusCode == 302) || (response.statusCode == 304)) {
            console.info('GET request for IMP main portal page returned response code: ' + response.statusCode);

            if (debug == true){
                console.info('Print response:\n');
                console.info(response);
                console.info('Print body:\n');
                console.info(body);
            }

            console.info('Calling GET request to Customer Portal Account Page: https://imperva.my.salesforce.com/apex/CustPortalAccount');
            getCustomerPortalAccountPage();

        }
        else {
            console.warn('Encountered unexpected response code. ');
            console.warn('Response code: ' + response.statusCode);
            if (debug == true) {
                console.info('Print response:\n');
                console.info(response);
            }
        }
    });
}


// function getPage3(url) {
//
//     // Configure headers for request
//     var headers = {
//         // 'User-Agent': 'user-agent:Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36',
//         // 'Content-Type': 'application/x-www-form-urlencoded'
//         // 'Cookie': cookie
//     };
//
// // Configure the GET request
//     var options = {
//         jar: true,
//         followAllRedirects: true,
//         url: url,
//         method: 'GET',
//         headers: headers
//     };
//
// // Start the request
//     request(options, function (error, response, body) {
//         console.info(response.statusCode);
//         console.info(body);
//
//         getCustomerPortalAccountPage('https://login.salesforce.com/login/sessionserver202.html');
//
//     });
// }



function getCustomerPortalAccountPage() {

// Third request - Build the GET request for IMP customer portal account (aka My Account)
    var options = {
        jar: true,
        followAllRedirects: true,
        url: 'https://imperva.my.salesforce.com/apex/CustPortalAccount',
        method: 'GET',
        headers: ''
    };

// Third request - Execute GET request or IMP customer portal account (aka My Account)
    console.info('About to execute GET request for Imperva Main Portal page');

    request(options, function (error, response, body) {
        console.info('Trying to connect: https://imperva.my.salesforce.com/apex/CustPortalAccount');


        if ((response.statusCode == 200) || (response.statusCode == 302) || (response.statusCode == 304)) {
            console.info('GET request for IMP main portal page returned response code: ' + response.statusCode);


            if (debug == true) {
                console.info('Print response:\n');
                console.info(response);
                console.info('Print body:\n');
                console.info(body);
            }

            // Prepare for next request. Extract parameter for AJAX POST request
            extractParametersFromBody(body);

            console.info('Calling POST request to Customer Portal Account Page - Environment section: https://imperva.my.salesforce.com/apex/CustPortalAccount');
            postCustomerPortalAccount();

        }
        else {
            console.warn('Encountered unexpected response code. ');
            console.warn('Response code: ' + response.statusCode);
            if (debug == true) {
                console.info('Print response:\n');
                console.info(response);
            }
        }


    });
}


function extractParametersFromBody(body) {

    // Find and extract value for com.salesforce.visualforce.ViewState
    var start = body.search((/(name="com\.salesforce\.visualforce\.ViewState" value=")/));
    var end = body.search((/(" \/><input type="hidden"  id="com\.salesforce\.visualforce\.ViewStateVersion")/));
    var viewStateTemp = body.slice(start,end);
    viewState = viewStateTemp.replace(/(name="com\.salesforce\.visualforce\.ViewState" value=")(.*)/g, "$2");

    // Find and extract value for com.salesforce.visualforce.ViewStateVersion
    start = body.search((/(name="com\.salesforce\.visualforce\.ViewStateVersion" value=")/));
    end = body.search((/(" \/><input type="hidden"  id="com\.salesforce\.visualforce\.ViewStateMAC")/));
    var viewStateVersionTemp = body.slice(start,end);
    viewStateVersion = viewStateVersionTemp.replace(/(name="com\.salesforce\.visualforce\.ViewStateVersion" value=")(.*)/g, "$2");

    // Find and extract value for com.salesforce.visualforce.ViewStateMAC
    start = body.search((/(name="com\.salesforce\.visualforce\.ViewStateMAC" value=")/));
    end = body.search((/(" \/><input type="hidden"  id="com\.salesforce\.visualforce\.ViewStateCSRF")/));
    var viewStateMacTemp = body.slice(start,end);
    viewStateMac = viewStateMacTemp.replace(/(name="com\.salesforce\.visualforce\.ViewStateMAC" value=")(.*)/g, "$2");

    // Find and extract value for com.salesforce.visualforce.ViewStateCSRF
    start = body.search((/(name="com\.salesforce\.visualforce\.ViewStateCSRF" value=")/));
    end = body.search((/(" \/><\/span><\/span>\n  <\/td>\n  \n  <td nowrap="nowrap")/));
    var viewStateCsrfTemp = body.slice(start,end);
    viewStateCsrf = viewStateCsrfTemp.replace(/(name="com\.salesforce\.visualforce\.ViewStateCSRF" value=")(.*)/g, "$2");


    if (printParametersInExtractionFunction == true){
        console.info('Print com.salesforce.visualforce.ViewState value: ' + viewState);
        console.info('Print com.salesforce.visualforce.ViewStateVersion value: ' + viewStateVersion);
        console.info('Print com.salesforce.visualforce.ViewState value: ' + viewStateMac);
        console.info('Print com.salesforce.visualforce.ViewState value: ' + viewStateCsrf);
    }
}


function postCustomerPortalAccount() {

// Configure headers for request
    var headers = {
        // 'User-Agent': 'user-agent:Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        // 'Cookie': cookie
    };

// Configure the GET request
    var options = {
        jar: true,
        followAllRedirects: true,
        url: 'https://imperva.my.salesforce.com/apex/CustPortalAccount',
        method: 'POST',
        headers: headers,
        form: {
            'AJAXREQUEST':'_viewRoot',
            'com.salesforce.visualforce.ViewState': viewState,
            'com.salesforce.visualforce.ViewStateCSRF': viewStateCsrf,
            'com.salesforce.visualforce.ViewStateMAC': viewStateMac,
            'com.salesforce.visualforce.ViewStateVersion': viewStateVersion,
            'j_id0:j_id4': 'j_id0:j_id4',
            'j_id0:j_id4:j_id7:j_id18': 'j_id0:j_id4:j_id7:j_id18',
            'section': 'environments'
        }
    };

    console.info('About to execute POST request for Environment section');


// Start the request
    request(options, function (error, response, body) {

        console.info('Trying to send POST request with AJAX params: https://imperva.my.salesforce.com/apex/CustPortalAccount');


        if ((response.statusCode == 200) || (response.statusCode == 302) || (response.statusCode == 304)) {
            console.info('POST request for Environment section returned response code: ' + response.statusCode);

            if (debug == true) {
                console.info('Print response:\n');
                console.info(response);
                console.info('Print body:\n');
                console.info(body);
            }

            console.info(body);

        }
        else {
            console.warn('Encountered unexpected response code. ');
            console.warn('Response code: ' + response.statusCode);
            if (debug == true) {
                console.info('Print response:\n');
                console.info(response);
            }
        }
    })
}
