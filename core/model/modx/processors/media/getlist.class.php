<?php
/**
 * Abstract class for Get Element processors. To be extended for each derivative element type.
 *
 * @abstract
 * @package modx
 * @subpackage processors.media
 */
class mediaGetListProcessor extends modProcessor {

    /**
     *
     * @return mixed
     */
    public function process() {
        $files = array(
            array(
                'src' => 'http://jpdevries.s3.amazonaws.com/mediabrowser/assets/images/DSC02399.jpg',
                'filename' => 'A',
                'filesize' => 1024,
                'dimensions' => '800x600',
                'editedon' => '1368286223000'
            ),
            array(
                'src' => 'http://jpdevries.s3.amazonaws.com/mediabrowser/assets/images/DSC02399.jpg',
                'filename' => 'B',
                'filesize' => 1024,
                'dimensions' => '800x600',
                'editedon' => '1368286223000'
            ),
            array(
                'src' => 'http://jpdevries.s3.amazonaws.com/mediabrowser/assets/images/DSC02399.jpg',
                'filename' => 'C',
                'filesize' => 1024,
                'dimensions' => '800x600',
                'editedon' => '1368286223000'
            ),
            array(
                'src' => 'http://jpdevries.s3.amazonaws.com/mediabrowser/assets/images/DSC02399.jpg',
                'filename' => 'D',
                'filesize' => 1024,
                'dimensions' => '800x600',
                'editedon' => '1368286223000'
            ),
            array(
                'src' => 'http://jpdevries.s3.amazonaws.com/mediabrowser/assets/images/DSC02399.jpg',
                'filename' => 'E',
                'filesize' => 1024,
                'dimensions' => '800x600',
                'editedon' => '1368286223000'
            )
        );

        return $this->outputArray($files, count($files));
    }
}
return 'mediaGetListProcessor';
