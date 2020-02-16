const error = (message) => {
    return `<div class="p-3 mb-2 bg-danger text-white">${message}</div>`;
}

const success = (message) => {
    return `<div class="p-3 mb-2 bg-success text-white">${message}</div>`;
}

$(function(){
    $("#form-message [type='submit']").each(function(){
        var text = $(this).text();
        $(this).html("").append("<span>"+ text +"</span>").prepend("<div class='status'><i class='fas fa-circle-notch fa-spin spinner'></i></div>");
    });

    $("#form-message .btn[type='submit']").on("click", function(e){
        var $button = $(this);
        var $form = $(this).closest("form");

        var $name = $("#form-contact-name").val();
        var $email = $("#form-contact-email").val();
        var $message = $("#form-contact-message").val();
        var $captcha = grecaptcha.getResponse();

        if($name.length == 0) return;
        if($email.length == 0) return; 
        if($message.length == 0) return; 
        if($captcha.length == 0){
            $(".form-contact-status").html(error('Você precisa resolver o desafio ReCaptcha.'));
            return false;
        }
        grecaptcha.reset();
        $button.addClass("processing");

        $.ajax({
            type: 'POST',
            url: 'https://sjp7.herokuapp.com/contact',
            data: JSON.stringify({
                name: $name,
                email: $email,
                message: $message,
                captcha: $captcha
            }),
            contentType: "application/json",
            success: function(data){
                $button.removeClass("processing");
                if(data.status == true) $(".form-contact-status").html(success(data.message));
                if(data.status == false) $(".form-contact-status").html(error(data.message));
            }
        });

        return false;
    });
})