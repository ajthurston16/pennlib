<?php

/**
 * @file
 * Contains \Drupal\menu_block\Plugin\Block\MenuBlock.
 */

namespace Drupal\menu_block\Plugin\Block;

use Drupal\Core\Form\FormStateInterface;
use Drupal\system\Entity\Menu;
use Drupal\system\Plugin\Block\SystemMenuBlock;

/**
 * Provides an extended Menu block.
 *
 * @Block(
 *   id = "menu_block",
 *   admin_label = @Translation("Menu block"),
 *   category = @Translation("Menus"),
 *   deriver = "Drupal\menu_block\Plugin\Derivative\MenuBlock"
 * )
 */
class MenuBlock extends SystemMenuBlock {

  /**
   * {@inheritdoc}
   */
  public function blockForm($form, FormStateInterface $form_state) {
    $config = $this->configuration;
    $defaults = $this->defaultConfiguration();

    $form['menu_levels'] = array(
      '#type' => 'details',
      '#title' => $this->t('Menu levels'),
      // Open if not set to defaults.
      '#open' => FALSE,
      '#process' => [[get_class(), 'processMenuBlockFieldSets']],
    );

    $options = range(0, $this->menuTree->maxDepth());
    unset($options[0]);

    $form['menu_levels']['level'] = array(
      '#type' => 'select',
      '#title' => $this->t('Initial menu level'),
      '#default_value' => $config['level'],
      '#options' => $options,
      '#description' => $this->t('The menu will only be visible if the menu item for the current page is at or below the selected starting level. Select level 1 to always keep this menu visible.'),
      '#required' => TRUE,
    );

    $options[0] = $this->t('Unlimited');

    $form['menu_levels']['depth'] = array(
      '#type' => 'select',
      '#title' => $this->t('Maximum number of menu levels to display'),
      '#default_value' => $config['depth'],
      '#options' => $options,
      '#description' => $this->t('The maximum number of menu levels to show, starting from the initial menu level. For example: with an initial level 2 and a maximum number of 3, menu levels 2, 3 and 4 can be displayed.'),
      '#required' => TRUE,
    );

    $form['advanced'] = array(
      '#type' => 'details',
      '#title' => $this->t('Advanced options'),
      '#open' => FALSE,
      '#process' => [[get_class(), 'processMenuBlockFieldSets']],
    );

    $form['advanced']['expand'] = array(
      '#type' => 'checkbox',
      '#title' => $this->t('<strong>Expand all menu links</strong>'),
      '#default_value' => $config['expand'],
      '#description' => $this->t('All menu links that have children will "Show as expanded".'),
    );

    $menu_name = $this->getDerivativeId();
    $menus = Menu::loadMultiple(array($menu_name));
    $menus[$menu_name] = $menus[$menu_name]->label();

    /** @var \Drupal\Core\Menu\MenuParentFormSelectorInterface $menu_parent_selector */
    $menu_parent_selector = \Drupal::service('menu.parent_form_selector');
    $form['advanced']['parent'] = $menu_parent_selector->parentSelectElement($config['parent'], '', $menus);

    $form['advanced']['parent'] += array(
      '#title' => $this->t('Fixed parent item'),
      '#description' => $this->t('Alter the options in “Menu levels” to be relative to the fixed parent item. The block will only contain children of the selected menu link.'),
    );

    // Open the details field sets if their config is not set to defaults.
    foreach(array('menu_levels', 'advanced') as $fieldSet) {
      foreach (array_keys($form[$fieldSet]) as $field) {
        if (isset($defaults[$field]) && $defaults[$field] !== $config[$field]) {
          $form[$fieldSet]['#open'] = TRUE;
        }
      }
    }

    return $form;
  }

  /**
   * Form API callback: Processes the elements in field sets.
   *
   * Adjusts the #parents of field sets to save its children at the top level.
   */
  public static function processMenuBlockFieldSets(&$element, FormStateInterface $form_state, &$complete_form) {
    array_pop($element['#parents']);
    return $element;
  }

  /**
   * {@inheritdoc}
   */
  public function blockSubmit($form, FormStateInterface $form_state) {
    $this->configuration['level'] = $form_state->getValue('level');
    $this->configuration['depth'] = $form_state->getValue('depth');
    $this->configuration['expand'] = $form_state->getValue('expand');
    $this->configuration['parent'] = $form_state->getValue('parent');
  }

  /**
   * {@inheritdoc}
   */
  public function build() {
    $menu_name = $this->getDerivativeId();
    $parameters = $this->menuTree->getCurrentRouteMenuTreeParameters($menu_name);

    // Adjust the menu tree parameters based on the block's configuration.
    $level = $this->configuration['level'];
    $depth = $this->configuration['depth'];
    $expand = $this->configuration['expand'];
    $parent = $this->configuration['parent'];

    $parameters->setMinDepth($level);
    // When the depth is configured to zero, there is no depth limit. When depth
    // is non-zero, it indicates the number of levels that must be displayed.
    // Hence this is a relative depth that we must convert to an actual
    // (absolute) depth, that may never exceed the maximum depth.
    if ($depth > 0) {
      $parameters->setMaxDepth(min($level + $depth - 1, $this->menuTree->maxDepth()));
    }
    // If expandedParents is empty, the whole menu tree is built.
    if ($expand) {
      $parameters->expandedParents = array();
    }
    // When a fixed parent item is set, root the menu true at the given ID.
    if ($menuLinkID = str_replace($menu_name . ':', '', $parent)) {
      $parameters->setRoot($menuLinkID);
    }

    $tree = $this->menuTree->load($menu_name, $parameters);
    $manipulators = array(
      array('callable' => 'menu.default_tree_manipulators:checkAccess'),
      array('callable' => 'menu.default_tree_manipulators:generateIndexAndSort'),
    );
    $tree = $this->menuTree->transform($tree, $manipulators);
    return $this->menuTree->build($tree);
  }

  /**
   * {@inheritdoc}
   */
  public function defaultConfiguration() {
    return [
      'level' => 1,
      'depth' => 0,
      'expand' => 0,
      'parent' => $this->getDerivativeId() . ':',
    ];
  }

}
