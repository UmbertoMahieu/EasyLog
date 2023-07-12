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

function get_current_acti(){
    let activitySelector = document.querySelector(".o-mail-Activity-info .text-break")
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
    return activities[0];
}

function set_next_activity(current_acti){
    let apps = extract_Apps();
    let current_acti_id = activities.findIndex(activity => activity == current_acti);
    let activity_to_add = 1
    return activities[current_acti_id + activity_to_add].name
}

function extract_Apps() {
    var log = document.querySelector("#description_0 p").textContent;
    if(log !== ''){
        try{
            var matches = log.match(/\*\*app:\s+(.+)/)[1]
            if (matches) {
                return matches.split(":");
            }
        }
        catch (error) {
            console.log("Le prospect n'a pas testé d'app")
        }
    }
    return null
}

function init_open_mailbox(){
    console.log("test");
    execute(".o-mail-Chatter-sendMessage", "initiation failed", el => {
        console.log("test2")
        let open_mail = document.querySelector("[aria-label='Full composer']");
        if (open_mail===null){
            console.log("test3")
            el.click();
        }
    })
}

function getLanguage(){
    let language = ""
    execute("#lang_id_1", "Language not found", el => {language = el.value})
    language = language.split(" ")[0]
    console.log(language)
    return language;
}

function get_email_to_send(){
    var language = getLanguage()
    return current_acti[language]
}

function is_last_activity(){
    if(_.isEqual(current_acti, activities[activities.length - 1]))
    {
        return true
    }
    return false;
}

function formatDate() {
    let dateString = "";
    execute("#date_input", "Date not found", el => {dateString = el.value})
    var parts = dateString.split('-');
    var formattedDate = parts[1] + '/' + parts[2] + '/' + parts[0];
    return formattedDate;
  }

// Settings variables
var macro = odoo.__DEBUG__.services["@web/core/macro"]; 
var engine = new macro.MacroEngine(); 

var record_acti = "na";
var department_acti = "DS - Call"

var activitiesList = JSON.parse(document.getElementById("Dre").innerText).data;
var activities = Array.from(Object.values(activitiesList));

// Activity variables
var next_date = formatDate();
var current_acti = get_current_acti();
var isLastActivity = is_last_activity();
// var apps = extract_Apps();


// Macro
var initialization = { 
    name: "Initialization", 
    steps: [{ 
        action: () => 
            { 
            if (document.querySelector("#email_from_0").value !== "" && document.querySelector(".o-mail-Activity") !== null){ 
                console.log("makeCall Macro Failed")
                console.log("sendEmail Macro Initiated")
                engine.activate(sendEmail)
            }
            else if (document.querySelector(".o-mail-Activity") !== null){ 
                console.log("makeCall Macro Failed")
                console.log("sendEmail Macro Failed")
                console.log("activityManager Macro Initiated")
                engine.activate(activityManager)
            }
            else{
                engine.activate(setFirstActivity);
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
                if (document.querySelector("#email_from_0").value !== "" && document.querySelector(".o-mail-Activity") !== null) { 
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
            // Reach Language Page
            action:() => {
                document.querySelector('[name ="lead"]').click();
            }
        }, 
        {
            // trigger: "#lang_id_1",
            //action: () => init_open_mailbox()
            action: () => {
                let send_email_but = document.querySelector(".o-mail-Chatter-sendMessage")
                let open_mail = document.querySelector("[aria-label='Full composer']");
                if (open_mail===null){
                    send_email_but.click();
                }
            }
        },
        {
            // Open the mail box
            trigger: "[aria-label='Full composer']", 
            action: "click"
        },
        {
            // Insert the email template that need to be send
            trigger: '#template_id_0',
            action: () => {
                document.querySelector('#template_id_0').value = get_email_to_send();
                document.querySelector('#template_id_0').click()
            }
        },
        {
            // Validate the email template
            trigger: "#template_id_0+ul>li>a",
            action: "click"
        },
        {
            trigger: () => {
                return document.querySelector(".modal-header") == null ? document.querySelector('body') : null 
            },
        },
        { 
            action: () => engine.activate(activityManager)
        },
    ]  
}


var activityManager = { 
    name: "activityManager", 
    steps: [
        {
            // Open activity report window 
            action: () => {
                document.querySelector(".o-mail-Activity-markDone").click()
            }
        },
        {
            // Add the basic "No Answer" report following an unreached call
            trigger: ".o_popover",
            action: () => {
                document.querySelector(".o_popover .form-control").value = record_acti
            }
        },
        {
            // Validate the report
            action: () => {
                document.querySelector("[aria-label='Done']").click()
            }
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

var setFirstActivity = { 
    name: "setFirstActivity", 
    steps: [
        {
            // Planify Next Activity. Simply open the window
            action: () => {
                document.querySelector("[data-hotkey='shift+a']").click()
            }
        },
        {
            // Insert Activity Type
            trigger: '#activity_type_id_0',
            action: "text", value: department_acti
        },
        {
            // Validate activity Type
            trigger: "#activity_type_id_0+ul>li>a",
            action: "click"
        },
        {
            // Planify next activity deadline
            trigger: '#date_deadline_0',
            action: () => {
                setTimeout(() => {
                    document.querySelector(".modal-content #date_deadline_0").value = next_date;
                    document.querySelector(".modal-content #date_deadline_0").dispatchEvent(new Event("change"))
                },800)
            }
        },  
        {
            // Insert Activity Summary
            trigger: "#summary_0",
            //$("#activity_type_id:propValue('demo2')")
            action: () => {
                setTimeout(() => {
                    document.querySelector('#summary_0').value = activities[0].name;
                }, 1000)
            }
        },
        {
            // Validate next Activity
            action: () => {
                setTimeout(() => {
                    document.querySelector('#mail_activity_save').click();
                }, 1500)
            }
        },
        {
            // Validate next Activity
            action: () => { 
                setTimeout(() => {
                    engine.activate(sendEmail)
                }, 2000)
            },
        }
    ]  
}


var activityPlanifier = { 
    name: "activityPlanifier", 
    steps: [
        {
            // Planify Next Activity. Simply open the window
            action: () => {
                document.querySelector('[name ="internal_notes"]').click()
            }
        },
        {
            // Planify Next Activity. Simply open the window
            action: () => {
                document.querySelector("[data-hotkey='shift+a']").click()
            }
        },
        {
            // Insert Activity Type
            trigger: '#activity_type_id_0',
            action: "text", value: department_acti
        },
        {
            // Validate activity Type
            trigger: "#activity_type_id_0+ul>li>a",
            action: "click"
        },
        {
            // Planify next activity deadline
            trigger: '#date_deadline_0',
            action: () => {
                setTimeout(() => {
                    document.querySelector(".modal-content #date_deadline_0").value = next_date;
                    document.querySelector(".modal-content #date_deadline_0").dispatchEvent(new Event("change"))
                },800)
            }
        }, 
        {
            // Insert Activity Summary
            trigger: "#summary_0",
            action: () => { 
                setTimeout(() => {
                    document.querySelector('#summary_0').value = set_next_activity(current_acti);
                }, 1000)
            }
        },
        {
            // Validate next Activity
            action: () => { 
                setTimeout(() => {
                    document.querySelector('#mail_activity_save').click();
                }, 1500)
            }
        }, 
        {
             // go to Next Opp
             action: () => {
                setTimeout(() => {
                    //  next_opp()
                    document.querySelector('[aria-label="Next"]').click();
                }, 2000)
            }
        }
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
            trigger: '.modal-content #lost_reason_id_0',
            action: "text", value: "No answer, not reached"
        },
        {
            // Validate activity Type
            trigger: ".modal-content #lost_reason_id_0+ul>li>a",
            action: "click"
        },
        {
            // Validate activity Type
            action: () => {document.querySelector('button[name = "action_lost_reason_apply"').click()}
        },
        {
            // go to Next Opp
            action: () => {
                // next_opp()
                document.querySelector('[aria-label="Next"]').click();
            }
        }
    ]  
}

// var testing = { 
//     name: "testing", 
//     steps: [
//         {
//             action: () => console.log("start")
//         },
//         {
//             action: () => init_open_mailbox()
//         }, 
//         {
//             action: () => console.log("finish")
//         }
//     ]  
// }

engine.activate(initialization);