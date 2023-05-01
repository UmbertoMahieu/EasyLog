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
    
function init_open_mailbox(){
    return execute(".o_ChatterTopbar_buttonSendMessage", "initiation failed", el => {
        let open_mail = document.querySelector(".o_ComposerView_button");
        if (open_mail===null){
            el.click();
        }
    })
}
    
function call(){
    return execute(".fa-phone", "no phone number found", el => el.click())
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

function hang_up(){
    return execute('[aria-label="End Call"]', "hang_up Failed", el => el.click())
}

function get_current_acti(){
    let activitySelector = document.querySelector(".o_ActivityView_summary")
    if(activitySelector){
        cleaned_current_acti = activitySelector.textContent.replace(/”|“/g, '');
        return activities.find(activity => activity.name == cleaned_current_acti)
    }
    return "undefined"
}

function next_opp(){
    return execute(".o_pager_next", "Coudn't get to next opp", el => el.click())
}


const activities = [
    {
        "name": "Call 1",
        "email_templateFR": "UMBM 1Mail (FR)",
        "email_templateEN": "UMBM 1Mail (EN)"
    },
    {
        "name": "Call 2",
        "email_templateFR": "UMBM 2Mail (FR)",
        "email_templateEN": "UMBM 2Mail (EN)"
    },
    {
        "name": "Call 3",
        "email_templateFR": "UMBM 3Mail (FR)",
        "email_templateEN": "UMBM 3Mail (EN)"
    },
    {
        "name": "Call 4",
        "email_templateFR": "UMBM 4Mail (FR)",
        "email_templateEN": "UMBM 4Mail (EN)"
    },
    {
        "name": "Call 5",
        "email_templateFR": "UMBM 5Mail (FR)",
        "email_templateEN": "UMBM 5Mail (EN)"
    }
]

function get_email_to_send(){
    let current_acti = get_current_acti();
    return current_acti.email_templateFR
}
    
function set_next_activity(){
    let activity_to_add = 1
    let current_acti_id = activities.findIndex(activity => activity == get_current_acti());
    // if(appId == "website_sales" || appId == "website"){
    //     number_to_add = 2
    // }
    return activities[current_acti_id + activity_to_add].name
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

    // window.addEventListener('load', () => {
    console.log("webpage loaded");
    console.log(getDate())

        // const script = document.createElement('script');
        // script.textContent = 'window.__ODOO__ = odoo;';
        // document.documentElement.appendChild(script);
        // script.remove();

        console.log(getDate());

        var macro = odoo.__DEBUG__.services["@web/core/macro"]; 
        var engine = new macro.MacroEngine(); 
        
        // Settings variables
        var record_acti = "na";
        var department_acti = "DS - Call"
        var array_acti = ["Call 1", "Call 2", "Call 3", "Call 4", "Call 5"];
        var array_mail = ["UMBM 1Mail (FR)", "UMBM 2Mail (FR)", "UMBM 3Mail (FR)", "UMBM 4Mail (FR)", "UMBM 5Mail (FR)"];
        
        //Apps tried 
        var logText = 'console.log(document.querySelector("#description p").textContent)\n\n**db: enjoy-agency1\n**app: timesheet_grid\n';
        var appId = extractAppIdFromConsoleLog(logText);
        
        // Activity variables
        var current_acti = get_current_acti();
        var next_acti_date = getDate();
        var acti_summary = set_next_activity(array_acti, current_acti);
        
        engine.activate({ 
            name: "callthemall", 
            steps: [
                {
                    // Launch the call
                    action: () => call()
                }, 
                {
                    trigger: '[aria-label="End Call"]',
                    action: () => setTimeout(() => {
                          hang_up();
                        }, 2000)
                },
                {
                    // Make sure we can open the mailbox
                    // trigger: '[aria-label="Call"]',
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
                    action: "text", value: get_email_to_send(array_acti, array_mail, current_acti)
                },
                {
                    // Validate the email template
                    trigger: "#template_id+ul>li>a",
                    action: "click"
                },
                {
                    // Send the mail
                    trigger: '[name="action_send_mail"]',
                    action: "click"
                },
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
                    // Insert Activity Summary
                    trigger: ".o_input",
                    action: () => setTimeout(() => {
                        document.querySelector('#summary').value = acti_summary
                        }, 2000)
                },
                {
                    // Planify next activity deadline
                    trigger: '#date_deadline',
                    action: () => setTimeout(() => {
                        document.querySelector(".modal-content #date_deadline").click();
                        const selector = `[data-day="${next_acti_date}"]`;
                        const element = document.querySelector(selector);
                        element.click()
                    },1000)
                }, 
                {
                    // Validate next Activity
                    trigger: () => {
                        document.querySelector(".modal-content #date_deadline").value == next_acti_date
                    },
                    action: () => {
                            document.querySelector('[name="action_close_dialog"]').click();
                        }
                }
                // {
                //     // Go to next opp
                //     action: () =>  next_opp()
                // },
            ]
        })
// })
    
    
    