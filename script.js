// Functions

function execute(selector, error, callback){
    let el = document.querySelector(selector);
    if(el){
        callback(el);
        return true;
    }
    else{
        console.log(error)
        return false;
    }
}
    
function call(){
    return execute(".fa-phone", "no phone number found", el => el.click())
}

function hang_up(){
    return execute('[aria-label="End Call"]', "hang_up Failed", el => el.click())
}
    
function open_mark_as_done(){
    return execute(".o_ActivityView_markDoneButton", "no activity found", el => el.click())
}

function write_acti_record(acti_record){
    return execute(".o_ActivityMarkDonePopoverContentView_feedback", "Activity Feedback Failed", el => el.value = acti_record)
}
    
function mark_as_done(){
    return execute(".o_ActivityMarkDonePopoverContentView_doneButton", "Activity MarkAsDone Failed", el => el.click())
}

function open_next_activity(){
    return execute(".o_ChatterTopbar_buttonScheduleActivity", "Open Next Activity Failed", el => el.click())
}

function get_current_acti(){
    let activitySelector = document.querySelector(".o_ActivityView_summary")
    if(activitySelector !== null){
        let cleaned_current_acti = activitySelector.textContent.replace(/”|“/g, '');
        let current = activities.find(activity => activity.name == cleaned_current_acti)
        if(current){
            return current;
        }
        else{
            alert("Activity does not match any record in activities")
            return false;
        }
    }
    alert("No activity found")
    return false;
}

function set_next_activity(current_acti){
    let apps = extract_Apps();
    let current_acti_id = activities.findIndex(activity => activity == current_acti);
    let activity_to_add = 1
    if(website_check(apps)){
        activity_to_add = 2
    }
    return activities[current_acti_id + activity_to_add].name
}

function init_extract_Apps(){
    return execute('[name ="internal_notes"]', "Coudn't reach Internal note Tab", el => el.click());
}

function extract_Apps() {
    var log = document.querySelector("#description p").textContent;
    var matches = log.match(/\*\*app:\s+(.+)/)[1]
    if (matches) {
        return matches.split(":");
    }
    return null
}

function website_check(apps){
    if(apps.length === 1 && (apps[0] === "website_sale" || apps[0] === "website")){
        return true
    }
    return false;
}

function init_open_mailbox(){
    return execute(".o_ChatterTopbar_buttonSendMessage", "initiation failed", el => {
        let open_mail = document.querySelector(".o_ComposerView_button");
        if (open_mail===null){
            el.click();
        }
    })
}

function init_getLanguage(){
    return execute('[name ="lead"]', "Coudn't reach Extra Info Tab", el => el.click())
}

function getLanguage(){
    let language = ""
    execute("#lang_id_1", "Language not found", el => {language = el.value})
    language = language.split(" ")[0]
    return language;
}

function get_email_to_send(){
    var language = getLanguage()
    return current_acti[language]
}

function getDate() {
    const today = new Date();
    let daysToAdd = 2;

    if (today.getDay() === 5) {
    daysToAdd = 7;
    }

    if (today.getDay() === 4) {
        daysToAdd = 6;
        }

    const futureDate = new Date(today.getTime() + (daysToAdd * 24 * 60 * 60 * 1000));

    if (futureDate.getDay() === 6) {
    futureDate.setDate(futureDate.getDate() + 2);
    }
    if (futureDate.getDay() === 0) {
    futureDate.setDate(futureDate.getDate() + 1);
    }

    const day = futureDate.getDate().toString().padStart(2, '0');
    const month = (futureDate.getMonth() + 1).toString().padStart(2, '0');
    const year = futureDate.getFullYear().toString();

    return `${month}/${day}/${year}`;
}
    
function extractAppIdFromConsoleLog(logText) {
    const matches = logText.match(/\*\*app:\s+(\w+)/);
    return matches ? matches[1] : null;
}

function is_last_activity(){
    if(_.isEqual(current_acti, activities[activities.length - 1]))
    {
        return true
    }
    return false;
}

function next_opp(){
    return execute(".o_pager_next", "Coudn't get to next opp", el => el.click())
}


// Settings variables
var macro = odoo.__DEBUG__.services["@web/core/macro"]; 
var engine = new macro.MacroEngine(); 

var record_acti = "na";
var department_acti = "DS - Call"
var activities = [
    {
        "name": "Call 1",
        "French": "UMBM 1Mail (FR)",
        "English": "UMBM 1Mail (EN)"
    },
    {
        "name": "Call 2",
        "French": "UMBM 2Mail (FR)",
        "English": "UMBM 2Mail (EN)"
    },
    {
        "name": "Call 3",
        "French": "UMBM 3Mail (FR)",
        "English": "UMBM 3Mail (EN)"
    },
    {
        "name": "Call 4",
        "French": "UMBM 4Mail (FR)",
        "English": "UMBM 4Mail (EN)"
    },
    {
        "name": "Call 5",
        "French": "UMBM 5Mail (FR)",
        "English": "UMBM 5Mail (EN)"
    }
]


// Activity variables
var current_acti = get_current_acti();
var isLastActivity = is_last_activity();
// var apps = extract_Apps();



// Macro

var initialization = { 
    name: "Initialization", 
    steps: [{ 
        action: () => { 
            if (document.querySelector("#phone").value !== "") { 
                console.log("makeCall Macro Initiated")
                engine.activate(makeCall) 
            } 
            else if (document.querySelector("#email_from").value !== "" && document.querySelector(".o_ActivityView_core") !== null){ 
                console.log("makeCall Macro Failed")
                console.log("sendEmail Macro Initiated")
                engine.activate(sendEmail)
            }
            else if (document.querySelector(".o_ActivityView_core") !== null){ 
                console.log("makeCall Macro Failed")
                console.log("sendEmail Macro Failed")
                console.log("activityManager Macro Initiated")
                engine.activate(activityManager)
            }
            else{
                alert("No Activity Planified, Script canceled");
            }
        } 
    } ] 
} 

var makeCall = { 
    name: "makeCall", 
    steps: [
        {
            // Launch the call
            action: () => call()
        }, 
        {
            // hang_up after seTimeout
            trigger: '[aria-label="End Call"]',
            action: () => setTimeout(() => {
                    hang_up();
                }, 2000)
        },
        { 
            action: () => { 
                if (document.querySelector("#email_from").value !== "" && document.querySelector(".o_ActivityView_core") !== null) { 
                    console.log("sendEmail Macro Follow-Up") 
                    engine.activate(sendEmail)
                } 
                else{
                    alert("No Activity Planified, Script canceled");
                }
            } 
        } 
    ]  
}

var sendEmail = { 
    name: "sendEmail", 
    steps: [
        {
            // Make sure we can read the language
            action: () => init_getLanguage()
        }, 
        {
            trigger: "#lang_id_1", 
            action: () => get_email_to_send()
        }, 
        {
            action: () => init_open_mailbox()
        },
        {
            // Open the mail box
            trigger: ".o_ComposerView_buttonFullComposer", 
            action: "click"
        },
        {
            // Insert the email template that need to be send
            trigger: '#template_id',
            action: () => {
                document.querySelector('#template_id').value = get_email_to_send();
                document.querySelector('#template_id').click()
            }
        },
        {
            // Validate the email template
            trigger: "#template_id+ul>li>a",
            action: "click"
        }
        // {
        //     // Send the mail
        //     trigger: '[name="action_send_mail"]',
        //     action: "click"
        // },
        // { 
        //     action: () => engine.activate(activityManager)
        // } 
    ]  
}

var activityManager = { 
    name: "activityManager", 
    steps: [
        {
            // Open activity report window 
            action: () => open_mark_as_done()
        },
        {
            // Add the basic "No Answer" report following an unreached call
            trigger: ".o_ActivityMarkDonePopoverContentView_feedback",
            action: () => write_acti_record(record_acti)
        },
        {
            // Validate the report
            action: () => mark_as_done()
        },
        { 
            action: () => { 
                if (isLastActivity) { 
                    console.log("lostOpp Macro Follow-Up")
                    engine.activate(lostOpp) 
                } 
                else { 
                    console.log("activityPlanifier Macro Follow-Up")
                    engine.activate(activityPlanifier); 
                } 
            } 
        } 
    ]  
}

var activityPlanifier = { 
    name: "activityPlanifier", 
    steps: [
        {
            // Planify Next Activity. Simply open the window
            action: () => init_extract_Apps()
        },
        {
            // Planify Next Activity. Simply open the window
            action: () => open_next_activity()
        },
        {
            // Insert Activity Type
            trigger: '#activity_type_id',
            action: "text", value: department_acti
        },
        {
            // Validate activity Type
            trigger: "#activity_type_id+ul>li>a",
            action: "click"
        },
        {
            // Planify next activity deadline
            trigger: '#date_deadline',
            action: () => setTimeout(() => {
                document.querySelector(".modal-content #date_deadline").value = "05/19/2023"
                document.querySelector(".modal-content #date_deadline").dispatchEvent(new Event("change"))
                },800)
        }, 
        {
            // Insert Activity Summary
            trigger: ".o_input",
            action: () => setTimeout(() => {
                document.querySelector('#summary').value = set_next_activity(current_acti);
                }, 1000)
        },
        {
            // Validate next Activity
            action: () => setTimeout(() => {
                    document.querySelector('[name="action_close_dialog"]').click();
                }, 1500)
        } 
        // {
        //     // go to Next Opp
        //     action: () => setTimeout(() => {
        //             next_opp()
        //         }, 3200)
        // }
    ]  
}

var lostOpp = { 
    name: "lostOpp", 
    steps: [
        {
            // Launch the call
            action: () => {document.querySelector('button[data-hotkey="l"]').click()}
        }, 
        {
            trigger: '.modal-content #lost_reason_id',
            action: "text", value: "No answer, not reached"
        },
        {
            // Validate activity Type
            trigger: ".modal-content #lost_reason_id+ul>li>a",
            action: "click"
        },
        {
            // Validate activity Type
            action: () => {document.querySelector('button[name = "action_lost_reason_apply"').click()}
        },
        {
            // go to Next Opp
            action: () => next_opp()
        }
    ]  
}

engine.activate(sendEmail);
