
function init_open_mailbox(){

    var open_mail = document.querySelector(".o_Composer_buttonFullComposer");
        
    if (open_mail===null){

        return document.querySelector(".o_ChatterTopbar_buttonSendMessage").click();
    }
}

function call(){
    if(document.querySelector(".fa-phone") != null){
        return document.querySelector(".fa-phone").click();
    }
    else{
        alert("there is no phone setup")
        return false;
    }
}

function open_mark_as_done(){
    if(document.querySelector(".o_Activity_markDoneButton") != null){
        return document.querySelector(".o_Activity_markDoneButton").click();
    }
    else{
        alert("Aucune activité planifiée");
        return false;
    }
}

function write_acti_record(acti){
    let acti_feedback_body = document.querySelector(".o_ActivityMarkDonePopoverContent_feedback");
    if(acti_feedback_body != null){
        return acti_feedback_body.value = acti;
    }
    else {
        return false;
    }
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
    let hang_up_btn = document.querySelector('[aria-label="End Call"]');
    try{
        hang_up_btn.click();
    }
    catch(error){
        console.error(error);
    }
}

function get_curent_acti(){
    if(document.querySelector(".o_Activity_summary") != null){
        let cleaned_current_acti = document.querySelector(".o_Activity_summary").textContent.replace(/”|“/g, '');
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
