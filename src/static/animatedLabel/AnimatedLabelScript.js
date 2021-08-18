function AnimatedLabel() {
    
    var input;
    var animatedLabelEl;
    
    var onFocus = function (event) {
        animatedLabelEl = osui.GetClosest(event.target, '.animated-label');
        if(animatedLabelEl){
            animatedLabelEl.classList.add('active');  
        } 
    };
    
    var onBlur = function (event) {
        animatedLabelEl = osui.GetClosest(event.target, '.animated-label');
        if (this.value.length === 0 && animatedLabelEl) {
            animatedLabelEl.classList.remove('active');
        }
    };
    
    var addEventListeners = function(input) {    
        
        if (input !== null) {
            input.addEventListener("focus", onFocus, true);
            input.addEventListener("blur", onBlur, true);
            input.addEventListener('animationstart', onAnimationStart, false);
        }
    };
    
    var updateLabel = function (input) {
        
        animatedLabelEl = osui.GetClosest(input, '.animated-label');

        if (input!== null && animatedLabelEl) {
            if (input.value === '' && input !== document.activeElement ) {
                animatedLabelEl.classList.remove('active');
                if(event && event.animationName === "onAutoFillStart") {
                    animatedLabelEl.classList.add('active');
                }
            } else {
               animatedLabelEl.classList.add('active'); 
            }            
        }
    };
    
    var onAnimationStart = function() {
        updateLabel(this);
    };

    return {
      
    //wrapperId from animated label wrapper
    init: function(wrapperId) {
        
        var input = document.getElementById(wrapperId);
        input = input.querySelector('input');
        var animatedLabelEl = osui.GetClosest(input, '.animated-label');
        
        if(input !== null && animatedLabelEl) {
            addEventListeners(input);
        }
    },
    update: function(wrapperId) {
        
        var input = document.getElementById(wrapperId);
        input = input.querySelector('input');

        updateLabel(input);
        
    }
  };

}