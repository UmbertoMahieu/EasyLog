function init_open_mailbox(){

    var open_mail = document.querySelector(".o_Composer_buttonFullComposer");
        
    if (open_mail===null){

        return document.querySelector(".o_ChatterTopbar_buttonSendMessage").click();
    }
}

function call(){
    document.querySelector(".fa-phone").click();
}

function open_mark_as_done(){
    return document.querySelector(".o_Activity_markDoneButton").click();
}

function write_acti(acti){
    return document.querySelector(".o_ActivityMarkDonePopoverContent_feedback").value = acti;
}

function mark_as_done(){
    return document.querySelector(".o_ActivityMarkDonePopoverContent_doneButton").click();
}

function open_next_activity(){
    document.querySelector(".o_ChatterTopbar_buttonScheduleActivity").click();
}

function hang_up(){
    document.querySelector('[aria-label="End Call"]').click(); 
}

function next_opp(){
    document.querySelector(".o_pager_next").click();
}

const macro = odoo.__DEBUG__.services["@web/core/macro"]; 
const engine = new macro.MacroEngine(); 
const acti = "na";

engine.activate({ 
    name: "callthemall", 
    steps: [
        {
            action: () => call()
        }, 
        {
            action: () => init_open_mailbox()
        }, 
        {
            trigger: ".o_Composer_buttonFullComposer", 
            action: "click"
        },
        {
            trigger: '#template_id',
            action: "text", value: "Welcome Demo"
        },
        {
            trigger: "#template_id+ul>li>a",
            action: "click"
        },
        {
            trigger: '[name="action_send_mail"]',
            action: "click"
        },
        {
            action: () => open_mark_as_done()
        },
        {
            trigger: ".o_ActivityMarkDonePopoverContent_feedback",
            action: () => write_acti(acti)
        },
        {
            action: () => mark_as_done()
        },
        {
            action: () => open_next_activity()
        },
        {
            trigger: '#activity_type_id',
            action: "text", value: "Call"
        },
        {
            trigger: "#activity_type_id+ul>li>a",
            action: "click"
        },
        {
            trigger: '[name="action_close_dialog"]',
            action: "click"
        },
        {
            action: () =>  hang_up()
        },
        {
            action: () =>  next_opp()
        },
    ]
})

