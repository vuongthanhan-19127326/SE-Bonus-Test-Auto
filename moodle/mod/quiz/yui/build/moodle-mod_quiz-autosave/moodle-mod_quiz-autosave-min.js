YUI.add("moodle-mod_quiz-autosave",function(s,e){M.mod_quiz=M.mod_quiz||{},M.mod_quiz.autosave={TINYMCE_DETECTION_DELAY:500,TINYMCE_DETECTION_REPEATS:20,WATCH_HIDDEN_DELAY:1e3,FAILURES_BEFORE_NOTIFY:1,FIRST_SUCCESSFUL_SAVE:-1,SELECTORS:{QUIZ_FORM:"#responseform",VALUE_CHANGE_ELEMENTS:'input, textarea, [contenteditable="true"]',CHANGE_ELEMENTS:"input, select",HIDDEN_INPUTS:"input[type=hidden]",CONNECTION_ERROR:"#connection-error",CONNECTION_OK:"#connection-ok"},AUTOSAVE_HANDLER:M.cfg.wwwroot+"/mod/quiz/autosave.ajax.php",delay:12e4,form:null,dirty:!1,delay_timer:null,save_transaction:null,savefailures:0,editor_change_handler:null,hidden_field_values:{},init:function(e){this.form=s.one(this.SELECTORS.QUIZ_FORM),this.form&&(this.delay=1e3*e,this.form.delegate("valuechange",this.value_changed,this.SELECTORS.VALUE_CHANGE_ELEMENTS,this),this.form.delegate("change",this.value_changed,this.SELECTORS.CHANGE_ELEMENTS,this),this.form.on("submit",this.stop_autosaving,this),require(["core_form/events"],function(e){window.addEventListener(e.eventTypes.uploadChanged,this.value_changed.bind(this))}.bind(this)),this.init_tinymce(this.TINYMCE_DETECTION_REPEATS),this.save_hidden_field_values(),this.watch_hidden_fields())},save_hidden_field_values:function(){this.form.all(this.SELECTORS.HIDDEN_INPUTS).each(function(e){var t=e.get("name");t&&(this.hidden_field_values[t]=e.get("value"))},this)},watch_hidden_fields:function(){this.detect_hidden_field_changes(),s.later(this.WATCH_HIDDEN_DELAY,this,this.watch_hidden_fields)},detect_hidden_field_changes:function(){this.form.all(this.SELECTORS.HIDDEN_INPUTS).each(function(e){var t=e.get("name"),i=e.get("value");t&&(t in this.hidden_field_values&&i===this.hidden_field_values[t]||(this.hidden_field_values[t]=i,this.value_changed({target:e})))},this)},init_tinymce:function(e){"undefined"!=typeof window.tinyMCE?(this.editor_change_handler=s.bind(this.editor_changed,this),window.tinyMCE.onAddEditor.add(s.bind(this.init_tinymce_editor,this))):0<e&&s.later(this.TINYMCE_DETECTION_DELAY,this,this.init_tinymce,[e-1])},init_tinymce_editor:function(e,t){t.onChange.add(this.editor_change_handler),t.onRedo.add(this.editor_change_handler),t.onUndo.add(this.editor_change_handler),t.onKeyDown.add(this.editor_change_handler)},value_changed:function(e){var t=e.target.getAttribute("name");"thispage"===t||"scrollpos"===t||t&&t.match(/_:flagged$/)||(t=t||"#"+e.target.getAttribute("id"),this.start_save_timer_if_necessary())},editor_changed:function(e){this.start_save_timer_if_necessary()},start_save_timer_if_necessary:function(){this.dirty=!0,this.delay_timer||this.save_transaction||this.start_save_timer()},start_save_timer:function(){this.cancel_delay(),this.delay_timer=s.later(this.delay,this,this.save_changes)},cancel_delay:function(){this.delay_timer&&!0!==this.delay_timer&&this.delay_timer.cancel(),this.delay_timer=null},save_changes:function(){if(this.cancel_delay(),this.dirty=!1,this.is_time_nearly_over())this.stop_autosaving();else{"undefined"!=typeof window.tinyMCE&&window.tinyMCE.triggerSave();var e=this.form.all("input[type=submit], button[type=submit]");e.setAttribute("type","button"),this.save_transaction=s.io(this.AUTOSAVE_HANDLER,{method:"POST",form:{id:this.form},on:{success:this.save_done,failure:this.save_failed},context:this}),e.setAttribute("type","submit")}},save_done:function(e,t){var i=JSON.parse(t.responseText);"OK"===i.status?("undefined"!=typeof i.timeleft&&M.mod_quiz.timer.updateEndTime(i.timeleft),this.save_transaction=null,this.dirty&&this.start_save_timer(),0<this.savefailures?(s.one(this.SELECTORS.CONNECTION_ERROR).hide(),s.one(this.SELECTORS.CONNECTION_OK).show(),this.savefailures=this.FIRST_SUCCESSFUL_SAVE):this.savefailures===this.FIRST_SUCCESSFUL_SAVE&&(s.one(this.SELECTORS.CONNECTION_OK).hide(),this.savefailures=0)):this.save_failed(e,t)},save_failed:function(){this.save_transaction=null,this.start_save_timer(),this.savefailures=Math.max(1,this.savefailures+1),this.savefailures===this.FAILURES_BEFORE_NOTIFY&&(s.one(this.SELECTORS.CONNECTION_ERROR).show(),s.one(this.SELECTORS.CONNECTION_OK).hide())},is_time_nearly_over:function(){return M.mod_quiz.timer&&M.mod_quiz.timer.endtime&&(new Date).getTime()+2*this.delay>M.mod_quiz.timer.endtime},stop_autosaving:function(){this.cancel_delay(),this.delay_timer=!0,this.save_transaction&&this.save_transaction.abort()}}},"@VERSION@",{requires:["base","node","event","event-valuechange","node-event-delegate","io-form"]});