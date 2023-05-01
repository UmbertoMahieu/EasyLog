function dosomething(selector, error, callback){
    let el = document.querySelector(selector);
    if(el){
    callback(el);
    return true;
    }
    else{
    alert(error)
    return false;
    }
    }
    
    function init_open_mailbox(){
    
    return dosomething(".o_ComposerView_button", "no mail box found", el => el.click())
    
    }
    
    function call(){
        if(document.querySelector(".fa-phone") != null){
            return document.querySelector(".fa-phone").click();
        }
        else{
            return false;
        }
    }
    
    function open_mark_as_done(){
        if(document.querySelector(".o_ActivityView_markDoneButton") != null){
            return document.querySelector(".o_ActivityView_markDoneButton").click();
        }
        else{
            alert("Aucune activité planifiée");
            return false;
        }
    }
    
    function write_acti_record(acti){
        let acti_feedback_body = document.querySelector(".o_ActivityMarkDonePopoverContentView_feedback");
        if(acti_feedback_body != null){
            return acti_feedback_body.value = acti;
        }
        else {
            return false;
        }
    }
    
    function mark_as_done(){
        return document.querySelector(".o_ActivityMarkDonePopoverContentView_doneButton").click();
    }
    
    function open_next_activity(){
        return document.querySelector(".o_ChatterTopbar_buttonScheduleActivity").click();
    }
    
    function hang_up(){
        let hang_up_btn = document.querySelector('[aria-label="End Call"]');
        try{
            hang_up_btn.click();
        }
        catch(error){
            console.error(error);
        }
    }
    
    function get_curent_acti(){
        if(document.querySelector(".o_ActivityView_summary") != null){
            let cleaned_current_acti = document.querySelector(".o_ActivityView_summary").textContent.replace(/”|“/g, '');
            return cleaned_current_acti;
        }
        return "undefined"
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
        let number_to_add = 1
        // if(appId == "website_sales" || appId == "website"){
        //     number_to_add = 2
        // }
        
        for (var i = 0 ; i < array_acti.length ; i++){
            if (array_acti[i] == current_acti){
                try{
                    return next_acti = array_acti[i+number_to_add];
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


chrome.runtime.onMessage.addListener((obj, sender, response) => {

    
    console.log("test");
    const macro = odoo.__DEBUG__.services["@web/core/macro"]; 
    const engine = new macro.MacroEngine(); 
    
    // Settings variables
    const record_acti = "na";
    const department_acti = "DS - Call"
    const array_acti = ["Call 1", "Call 2", "Call 3", "Call 4", "Call 5"];
    const array_mail = ["UMBM 1Mail (FR)", "UMBM 2Mail (FR)", "UMBM 3Mail (FR)", "UMBM 4Mail (FR)", "UMBM 5Mail (FR)"];
    
    //Apps tried 
    const logText = 'console.log(document.querySelector("#description p").textContent)\n\n**db: enjoy-agency1\n**app: timesheet_grid\n';
    const appId = extractAppIdFromConsoleLog(logText);
    
    // Activity variables
    let current_acti = get_curent_acti();
    let next_acti_date = getDate();
    let acti_summary = set_next_activity(array_acti, current_acti);
    
    engine.activate({ 
        name: "callthemall", 
        steps: [
            // {
            //     // Launch the call
            //     action: () => call()
            // }, 
            // {
            //     trigger: '[aria-label="End Call"]',
            //     action: () => setTimeout(() => {
            //           hang_up();
            //         }, 2000)
            // },
            // {
            //     // Make sure we can open the mailbox
            //     // trigger: '[aria-label="Call"]',
            //     action: () => init_open_mailbox()
            // }, 
            // {
            //     // Open the mail box
            //     trigger: ".o_ComposerView_buttonFullComposer", 
            //     action: "click"
            // },
            // {
            //     // Insert the email template that need to be send
            //     trigger: '#template_id',
            //     action: "text", value: get_email_to_send(array_acti, array_mail, current_acti)
            // },
            // {
            //     // Validate the email template
            //     trigger: "#template_id+ul>li>a",
            //     action: "click"
            // },
            // {
            //     // Send the mail
            //     trigger: '[name="action_send_mail"]',
            //     action: "click"
            // },
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

    }
)
    
    
    