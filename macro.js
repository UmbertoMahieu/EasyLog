function init_open_mailbox(){

    var open_mail = document.querySelector(".o_Composer_buttonFullComposer");
        
    if (open_mail===null){

        return document.querySelector(".o_ChatterTopbar_buttonSendMessage").click();
    }
}

function call(){
    return document.querySelector(".fa-phone").click();
}

function open_mark_as_done(){
    return document.querySelector(".o_Activity_markDoneButton").click();
}

function write_acti_record(acti){
    return document.querySelector(".o_ActivityMarkDonePopoverContent_feedback").value = acti;
}

function write_acti_type(acti){
    return document.querySelector(".o_ActivityMarkDonePopoverContent_feedback").value = acti;
}

function mark_as_done(){
    return document.querySelector(".o_ActivityMarkDonePopoverContent_doneButton").click();
}

function open_next_activity(){
    return document.querySelector(".o_ChatterTopbar_buttonScheduleActivity").click();
}

function hang_up(){
    return document.querySelector('[aria-label="End Call"]').click(); 
}

function next_opp(){
    return document.querySelector(".o_pager_next").click();
}

function get_email_to_send(array_acti, array_mail, current_acti){
    for (var i = 0 ; i < array_acti.length ; i++){
        if (array_acti[i] == current_acti){
            return array_mail[i];
        }
    }
}

function set_next_activity(array_acti, current_acti){
    for (var i = 0 ; i < array_acti.length ; i++){
        if (array_acti[i] == current_acti){
            try{
                return next_acti = array_acti[i+1];
            } catch (error){
                console.error(error);
                return false;
            }
        }
    }
}

function getDate() {
    const today = new Date();
    let daysToAdd = 2;
  
    if (today.getDay() === 5) {
      daysToAdd = 4;
    }

    if (today.getDay() === 4) {
        daysToAdd = 4;
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
  
    return `${day}/${month}/${year}`;
  }
  

const macro = odoo.__DEBUG__.services["@web/core/macro"]; 
const engine = new macro.MacroEngine(); 

// Settings variables
const record_acti = "na";
const department_acti = "Call"
const array_acti = ["call 1", "call 2", "call 3"];
const array_mail = ["email 1", "email 2", "email 3"];

// Activity variables
let current_acti = document.querySelector(".o_Activity_summary").textContent.replace(/”|“/g, '');
let next_acti = set_next_activity(array_acti, current_acti);
let next_acti_date = getDate();

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
                }, 15000)
        },
        {
            // Make sure we can open the mailbox
            trigger: '[aria-label="Call"]',
            action: () => init_open_mailbox()
        }, 
        {
            trigger: ".o_Composer_buttonFullComposer", 
            action: "click"
        },
        {
            // Insert the email template that need to be send
            trigger: '#template_id',
            action: "text", value: get_email_to_send(array_acti, array_mail, current_acti)
        },
        {
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
            trigger: ".o_ActivityMarkDonePopoverContent_feedback",
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
            trigger: "#activity_type_id+ul>li>a",
            action: "click"
        },
        {
            // Insert Activity Summary
            trigger: "#summary",
            action: "text", value: next_acti
        },
        {
            // Insert Activity Summary
            trigger: '[data-target = "#o_datepicker_7"]',
            action: "text", value: next_acti_date
        },
        {
            // Validate next Activity
            trigger: '[name="action_close_dialog"]',
            action: "click"
        },
        {
            // Go to next opp
            action: () =>  next_opp()
        },
    ]
})

