<?php
/**
 * Loads the MODx.Browser page
 *
 * @package modx
 * @subpackage manager.controllers
 */
class MediaBrowserManagerController extends modManagerController {
    public $ctx;
    public $loadBaseJavascript = true;
    
    /**
     * Check for any permissions or requirements to load page
     * @return bool
     */
    public function checkPermissions() {
        return $this->modx->hasPermission('file_manager');
    }

    /**
     * Register custom CSS/JS for the page
     * @return void
     */
    public function loadCustomCssJs() {
        /* invoke OnRichTextBrowserInit */
        $this->addHtml('<script type="text/javascript">
MODx.siteId = "'.$this->modx->user->getUserToken($this->modx->context->get('key')).'";
MODx.ctx = "'.$this->ctx.'";
</script>');
        $mgrUrl = $this->modx->getOption('manager_url',null,MODX_MANAGER_URL);
        $this->addCss($mgrUrl.'templates/default/css/mediabrowser.css');
        $this->addJavascript($mgrUrl.'assets/modx/vendor/modernizr-2.6.2.min.js');
        $this->addJavascript($mgrUrl.'assets/modx/vendor/jquery-1.10.2.min.js');
        $this->addJavascript($mgrUrl.'assets/modx/media-2.3.0.js');
    }

    /**
     * Custom logic code here for setting placeholders, etc
     * @param array $scriptProperties
     * @return mixed
     */
    public function process(array $scriptProperties = array()) {
        $placeholders = array();

        $rtecallback = $this->modx->invokeEvent('OnRichTextBrowserInit');
        if (is_array($rtecallback)) $rtecallback = trim(implode(',',$rtecallback),',');
        $placeholders['rtecallback'] = $rtecallback;

        $this->ctx = !empty($scriptProperties['ctx']) ? $scriptProperties['ctx'] : 'web';
        $placeholders['_ctx'] = $this->ctx;

        $_SERVER['HTTP_MODAUTH'] = $this->modx->user->getUserToken($this->modx->context->get('key'));
        $placeholders['site_id'] = $_SERVER['HTTP_MODAUTH'];

        $placeholders['source'] = $this->modx->getOption('source',$scriptProperties,$this->modx->getOption('default_media_source',null,1));

        return $placeholders;
    }

    /**
     * Return the pagetitle
     *
     * @return string
     */
    public function getPageTitle() {
        return $this->modx->lexicon('modx_resource_browser');
    }

    /**
     * Return the location of the template file
     * @return string
     */
    public function getTemplateFile() {
        return 'media/browser.tpl'; 
    }

    /**
     * Specify the language topics to load
     * @return array
     */
    public function getLanguageTopics() {
        return array('file');
    }
}