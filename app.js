/// Functions

function call(){
    document.querySelector(".fa-phone").click();
}
    
function hang_up(){
    document.querySelector('[aria-label="End Call"]').click(); 
}
    
function get_acti(){
    if(document.querySelector(".o_Activity_summary") != null){
                return document.querySelector(".o_Activity_summary").textContent;
    }
}
    
function init_open_mailbox(){

    var open_mail = document.querySelector(".o_Composer_buttonFullComposer");
        
    if (open_mail===null){

        return document.querySelector(".o_ChatterTopbar_buttonSendMessage").click();
    }
}

function open_mailbox(){
    return document.querySelector(".o_Composer_buttonFullComposer").click();
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

function next_opp(){
    document.querySelector(".o_pager_next").click();
}

function send_mail(){

    var template_field = document.getElementById("template_id");
    var textarea = document.getElementById("body");

    template_field.value = "test";

    template_field.addEventListener('click', function() {

        var template_mail = document.querySelector("#template_id+ul>li>a");

        if(template_mail==null){
            setTimeout(function(){
                template_field.dispatchEvent(new Event("click"));
            },1000);
            return
        }
        else {
            template_mail.click();
            document.getElementsByName("action_send_mail")[0].click();
        }

    });

    template_field.click();
}

function planify_next_activity(){

    var activity_field = document.getElementById("activity_type_id");
    
    activity_field.value = "Call";

    activity_field.addEventListener('click', function() {

        var template_acti = document.querySelector("#activity_type_id+ul>li>a");

        if(template_acti==null){

            setTimeout(function(){
                
                activity_field.dispatchEvent(new Event("click"));

            },1000);

            return

        }

        template_acti.click();

        setTimeout(function(){
            document.getElementsByName("action_close_dialog")[0].click();
        }, 2000);
    });

    activity_field.click();
}

/// Script

//Calling 

call();

setTimeout(function(){
    hang_up();
}, 10000);

// Send Email Template
    
current_acti = get_acti();
        
init_open_mailbox();

setTimeout(function(){
    open_mailbox();
}, 2000);
        
setTimeout(function(){ 
    send_mail();
}, 3000);

// Manage Current Activity
            
setTimeout(function(){
    open_mark_as_done();
        
    setTimeout(function(){
        write_acti("na");
    }, 1000);
            
    setTimeout(function(){
        mark_as_done();    
    }, 1000);
}, 7000);
        
// Planify Next Activity

setTimeout(function(){
    open_next_activity()
}, 8000);

setTimeout(function(){
    planify_next_activity();
}, 9000);
        
setTimeout(function(){
    next_opp();
}, 12000);
