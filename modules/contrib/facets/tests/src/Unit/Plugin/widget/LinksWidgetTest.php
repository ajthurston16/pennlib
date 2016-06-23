<?php

namespace Drupal\Tests\facets\Unit\Plugin\widget;

use Drupal\Component\Render\FormattableMarkup;
use Drupal\Core\Url;
use Drupal\facets\Entity\Facet;
use Drupal\facets\Plugin\facets\widget\LinksWidget;
use Drupal\facets\Result\Result;
use Drupal\Tests\UnitTestCase;

/**
 * Unit test for widget.
 *
 * @group facets
 */
class LinksWidgetTest extends UnitTestCase {

  /**
   * The processor to be tested.
   *
   * @var \drupal\facets\Widget\WidgetInterface
   */
  protected $widget;

  /**
   * An array containing the results before the processor has ran.
   *
   * @var \Drupal\facets\Result\Result[]
   */
  protected $originalResults;

  /**
   * Creates a new processor object for use in the tests.
   */
  protected function setUp() {
    parent::setUp();

    /** @var \Drupal\facets\Result\Result[] $original_results */
    $original_results = [
      new Result('llama', 'Llama', 10),
      new Result('badger', 'Badger', 20),
      new Result('duck', 'Duck', 15),
      new Result('alpaca', 'Alpaca', 9),
    ];

    foreach ($original_results as $original_result) {
      $original_result->setUrl(new Url('test'));
    }
    $this->originalResults = $original_results;

    $this->widget = new LinksWidget();
  }

  /**
   * Tests widget without filters.
   */
  public function testNoFilterResults() {
    $facet = new Facet([], 'facet');
    $facet->setResults($this->originalResults);
    $facet->setWidgetConfigs(['show_numbers' => 1]);

    $output = $this->widget->build($facet);

    $this->assertInternalType('array', $output);
    $this->assertCount(4, $output['#items']);

    $expected_links = [
      $this->buildLinkAssertion('Llama', 10),
      $this->buildLinkAssertion('Badger', 20),
      $this->buildLinkAssertion('Duck', 15),
      $this->buildLinkAssertion('Alpaca', 9),
    ];
    foreach ($expected_links as $index => $value) {
      $this->assertInternalType('array', $output['#items'][$index]);
      $this->assertEquals($value, $output['#items'][$index]['#title']);
      $this->assertInstanceOf(FormattableMarkup::class, $output['#items'][$index]['#title']);
      $this->assertEquals('link', $output['#items'][$index]['#type']);
      $this->assertEquals(['facet-item'], $output['#items'][$index]['#wrapper_attributes']['class']);
    }
  }

  /**
   * Test widget with 2 active items.
   */
  public function testActiveItems() {
    $original_results = $this->originalResults;
    $original_results[0]->setActiveState(TRUE);
    $original_results[3]->setActiveState(TRUE);

    $facet = new Facet([], 'facet');
    $facet->setResults($original_results);
    $facet->setWidgetConfigs(['show_numbers' => 1]);

    $output = $this->widget->build($facet);

    $this->assertInternalType('array', $output);
    $this->assertCount(4, $output['#items']);

    $expected_links = [
      $this->buildLinkAssertion('Llama', 10, TRUE),
      $this->buildLinkAssertion('Badger', 20),
      $this->buildLinkAssertion('Duck', 15),
      $this->buildLinkAssertion('Alpaca', 9, TRUE),
    ];
    foreach ($expected_links as $index => $value) {
      $this->assertInternalType('array', $output['#items'][$index]);
      $this->assertEquals($value, $output['#items'][$index]['#title']);
      $this->assertEquals('link', $output['#items'][$index]['#type']);
      if ($index === 0 || $index === 3) {
        $this->assertEquals('is-active', $output['#items'][$index]['#attributes']['class']);
      }
      $this->assertEquals(['facet-item'], $output['#items'][$index]['#wrapper_attributes']['class']);
    }
  }

  /**
   * Tests widget, make sure hiding and showing numbers works.
   */
  public function testHideNumbers() {
    $original_results = $this->originalResults;
    $original_results[1]->setActiveState(TRUE);

    $facet = new Facet([], 'facet');
    $facet->setResults($original_results);
    $facet->setWidgetConfigs(['show_numbers' => 0]);

    $output = $this->widget->build($facet);

    $this->assertInternalType('array', $output);
    $this->assertCount(4, $output['#items']);

    $expected_links = [
      $this->buildLinkAssertion('Llama', 10, FALSE, FALSE),
      $this->buildLinkAssertion('Badger', 20, TRUE, FALSE),
      $this->buildLinkAssertion('Duck', 15, FALSE, FALSE),
      $this->buildLinkAssertion('Alpaca', 9, FALSE, FALSE),
    ];
    foreach ($expected_links as $index => $value) {
      $this->assertInternalType('array', $output['#items'][$index]);
      $this->assertEquals($value, $output['#items'][$index]['#title']);
      $this->assertEquals('link', $output['#items'][$index]['#type']);
      if ($index === 1) {
        $this->assertEquals('is-active', $output['#items'][$index]['#attributes']['class']);
      }
      $this->assertEquals(['facet-item'], $output['#items'][$index]['#wrapper_attributes']['class']);
    }

    // Enable the 'show_numbers' setting again to make sure that the switch
    // between those settings works.
    $facet->setWidgetConfigs(['show_numbers' => 1]);

    $output = $this->widget->build($facet);

    $this->assertInternalType('array', $output);
    $this->assertCount(4, $output['#items']);

    $expected_links = [
      $this->buildLinkAssertion('Llama', 10),
      $this->buildLinkAssertion('Badger', 20, TRUE),
      $this->buildLinkAssertion('Duck', 15),
      $this->buildLinkAssertion('Alpaca', 9),
    ];
    foreach ($expected_links as $index => $value) {
      $this->assertInternalType('array', $output['#items'][$index]);
      $this->assertEquals($value, $output['#items'][$index]['#title']);
      $this->assertEquals('link', $output['#items'][$index]['#type']);
      if ($index === 1) {
        $this->assertEquals('is-active', $output['#items'][$index]['#attributes']['class']);
      }
      $this->assertEquals(['facet-item'], $output['#items'][$index]['#wrapper_attributes']['class']);
    }
  }

  /**
   * Tests for links widget with children.
   */
  public function testChildren() {
    $original_results = $this->originalResults;

    $child = new Result('snake', 'Snake', 5);
    $original_results[1]->setActiveState(TRUE);
    $original_results[1]->setChildren($child);

    $facet = new Facet([], 'facet');
    $facet->setResults($original_results);
    $facet->setWidgetConfigs(['show_numbers' => 1]);

    $output = $this->widget->build($facet);

    $this->assertInternalType('array', $output);
    $this->assertCount(4, $output['#items']);

    $expected_links = [
      $this->buildLinkAssertion('Llama', 10),
      $this->buildLinkAssertion('Badger', 20, TRUE),
      $this->buildLinkAssertion('Duck', 15),
      $this->buildLinkAssertion('Alpaca', 9),
    ];
    foreach ($expected_links as $index => $value) {
      $this->assertInternalType('array', $output['#items'][$index]);
      $this->assertEquals($value, $output['#items'][$index]['#title']);
      $this->assertEquals('link', $output['#items'][$index]['#type']);
      if ($index === 1) {
        $this->assertEquals('active-trail', $output['#items'][$index]['#attributes']['class']);
        $this->assertEquals(['facet-item', 'expanded'], $output['#items'][$index]['#wrapper_attributes']['class']);
      }
      else {
        $this->assertEquals(['facet-item'], $output['#items'][$index]['#wrapper_attributes']['class']);
      }
    }

  }

  /**
   * Build a formattable markup object to use in the other tests.
   *
   * @param string $text
   *   Text to display.
   * @param int $count
   *   Number of results.
   * @param bool $active
   *   Link is active.
   * @param bool $show_numbers
   *   Numbers are displayed.
   *
   * @return \Drupal\Component\Render\FormattableMarkup
   *   Formattable markup object for link.
   */
  protected function buildLinkAssertion($text, $count = 0, $active = FALSE, $show_numbers = TRUE) {
    $text = new FormattableMarkup('@text', ['@text' => $text, '@count' => $count]);
    if ($show_numbers !== FALSE) {
      $text->string .= ' <span class="facet-count">(@count)</span>';
    }
    if ($active) {
      $text->string = '<span class="facet-deactivate">(-)</span> ' . $text->string;
    }
    return $text;
  }

}
