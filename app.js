document.querySelector(".fa-phone").click();

var activity_type = document.querySelector(".o_Activity_summary").textContent;

var open_mail = document.querySelector(".o_Composer_buttonFullComposer");

if (open_mail===null){
    document.querySelector(".o_ChatterTopbar_buttonSendMessage").click();
}

setTimeout(function(){
    document.querySelector(".o_Composer_buttonFullComposer").click();
}, 2000);

setTimeout(function(){
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
        template_mail.click();
        setTimeout(function(){
            document.getElementsByName("action_send_mail")[0].click();
        }, 2000);
    });
    template_field.click();
}, 3000);

setTimeout(function(){
    document.querySelector('[aria-label="End Call"]').click();
}, 10000);

setTimeout(function(){
    document.querySelector(".o_Activity_markDoneButton").click();
    setTimeout(function(){
        document.querySelector(".o_ActivityMarkDonePopoverContent_feedback").value = "na";
    }, 1000);
    setTimeout(function(){
        document.querySelector(".o_ActivityMarkDonePopoverContent_doneButton").click();
    }, 1000);
}, 7000);
