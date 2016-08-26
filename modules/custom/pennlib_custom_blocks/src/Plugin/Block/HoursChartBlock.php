<?php
/**
 * @file
 * Contains \Drupal\pennlib_custom_blocks\Plugin\Block\HoursChartBlock.
 */
namespace Drupal\pennlib_custom_blocks\Plugin\Block;
use Drupal\Core\Block\BlockBase;

/**
 * Provides an 'Hours Chart' block.
 *
 * @Block(
 *   id = "pennlib_hours_chart",
 *   admin_label = @Translation("Library Hours Chart")
 * )
 */
class HoursChartBlock extends BlockBase {
  /**
   * {@inheritdoc}
   */
  public function build() {
    return array(
      '#type'=>'markup'
    );
  }
}