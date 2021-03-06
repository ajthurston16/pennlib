<?php

namespace Drupal\facets\Tests;

use Drupal\Component\Render\FormattableMarkup;
use Drupal\search_api\Entity\Index;

/**
 * Contains helpers to create data that can be used by tests.
 */
trait ExampleContentTrait {

  /**
   * The generated test entities, keyed by ID.
   *
   * @var \Drupal\entity_test\Entity\EntityTestMulRevChanged[]
   */
  protected $entities = [];

  /**
   * Sets up the necessary bundles on the test entity type.
   */
  protected function setUpExampleStructure() {
    entity_test_create_bundle('item', NULL, 'entity_test_mulrev_changed');
    entity_test_create_bundle('article', NULL, 'entity_test_mulrev_changed');
  }

  /**
   * Creates several test entities.
   */
  protected function insertExampleContent() {
    $count = \Drupal::entityQuery('entity_test_mulrev_changed')
      ->count()
      ->execute();

    $entity_test_storage = \Drupal::entityTypeManager()
      ->getStorage('entity_test_mulrev_changed');
    $this->entities[1] = $entity_test_storage->create(array(
      'name' => 'foo bar baz',
      'body' => 'test test',
      'type' => 'item',
      'keywords' => array('orange'),
      'category' => 'item_category',
    ));
    $this->entities[1]->save();
    $this->entities[2] = $entity_test_storage->create(array(
      'name' => 'foo test',
      'body' => 'bar test',
      'type' => 'item',
      'keywords' => array('orange', 'apple', 'grape'),
      'category' => 'item_category',
    ));
    $this->entities[2]->save();
    $this->entities[3] = $entity_test_storage->create(array(
      'name' => 'bar',
      'body' => 'test foobar',
      'type' => 'item',
    ));
    $this->entities[3]->save();
    $this->entities[4] = $entity_test_storage->create(array(
      'name' => 'foo baz',
      'body' => 'test test test',
      'type' => 'article',
      'keywords' => array('apple', 'strawberry', 'grape'),
      'category' => 'article_category',
    ));
    $this->entities[4]->save();
    $this->entities[5] = $entity_test_storage->create(array(
      'name' => 'bar baz',
      'body' => 'foo',
      'type' => 'article',
      'keywords' => array('orange', 'strawberry', 'grape', 'banana'),
      'category' => 'article_category',
    ));
    $this->entities[5]->save();
    $count = \Drupal::entityQuery('entity_test_mulrev_changed')
        ->count()
        ->execute() - $count;
    $this->assertEqual($count, 5, "$count items inserted.");
  }

  /**
   * Indexes all (unindexed) items on the specified index.
   *
   * @param string $index_id
   *   The ID of the index on which items should be indexed.
   *
   * @return int
   *   The number of successfully indexed items.
   */
  protected function indexItems($index_id) {
    /** @var \Drupal\search_api\IndexInterface $index */
    $index = Index::load($index_id);
    return $index->indexItems();
  }

  /**
   * Asserts that a string is found before another string in the source.
   *
   * This uses the simpletest's getRawContent method to search in the source of
   * the page for the position of 2 strings and that the first argument is
   * before the second argument's position.
   *
   * @param string $x
   *   A string.
   * @param string $y
   *   Another string.
   */
  protected function assertStringPosition($x, $y) {
    $this->assertRaw($x);
    $this->assertRaw($y);

    $x_position = strpos($this->getRawContent(), $x);
    $y_position = strpos($this->getRawContent(), $y);

    $message = new FormattableMarkup('Assert that %x is before %y in the source', ['%x' => $x, '%y' => $y]);
    $this->assertTrue($x_position < $y_position, $message);
  }

}
