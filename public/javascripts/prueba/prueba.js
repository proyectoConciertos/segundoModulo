postShareButtonClick = $(function (){
    var buttonWrapper = $(".share-button"),
        button = $(".share-button > a"),
        icons = $(".share-button > .icon-wrapper"),
        close = $(".close-social-icons");
    
    function init(){
        button.on("click", toggle);
        close.on("click", closeIcons);
    }
    
    function toggle(e){
        if (buttonWrapper.hasClass("active")){
            closeIcons();
        } else{
            openIcons();
        }
        e.preventDefault();
    }
    
    function openIcons(){
        buttonWrapper.addClass("active");
        button.addClass("hidden");
        buttonWrapper.animate({width: "286"}, 500);
        icons.animate({left: "0"}, 500);
    }
    
    function closeIcons(){
        buttonWrapper.removeClass("active");
          button.removeClass("hidden");
        icons.animate({left: "-286"}, 0);
        buttonWrapper.animate({width: "178"}, 0);
    }
    
    init();
});