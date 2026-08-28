StartupEvents.registry('creative_mode_tab', event => {
	event.create('cat_food').icon(() => 'kubejs:soul_spaghetti').displayName(("Cat's Foods")).content(showRestrictedItems => [
        'kubejs:powdered_soul',
        'kubejs:soul_crust',
        'kubejs:soul_dough',
        'kubejs:soul_pasta',
        'kubejs:soul_pie',
        'kubejs:soul_sausage',
        'kubejs:soul_spaghetti'
  ])
})
StartupEvents.registry('item', event => {
  // Ingredients
  event.create('powdered_soul')
    .displayName('Powdered Soul')
    .texture('thecatlord:item/food/powdered_soul')
  event.create('soul_crust')
    .displayName('Soul Crust')
    .texture('thecatlord:item/food/soul_crust')
    .food(food => {
      food
        .nutrition(2)
        .saturation(0.2)
    })
  event.create('soul_dough')
    .displayName('Soul Dough')
    .texture('thecatlord:item/food/soul_dough')
    .food(food => {
      food
        .nutrition(2)
        .saturation(0.3)
        .effect('minecraft:hunger', 600, 0, 0.3)
    })
  event.create('soul_pasta')
    .displayName('Soul Pasta')
    .texture('thecatlord:item/food/soul_pasta')
    .food(food => {
      food
        .nutrition(2)
        .saturation(0.3)
        .effect('minecraft:hunger', 600, 0, 0.3)
    })
  // Finished Foods
  event.create('soul_pie')
    .displayName('Soul Pie')
    .texture('thecatlord:item/food/soul_pie')
    .food(food => {
      food
        .nutrition(8)
        .saturation(0.3)
    })
  event.create('soul_sausage')
    .displayName('Soul Sausage')
    .texture('thecatlord:item/food/soul_sausage')
    .food(food => {
      food
        .nutrition(8)
        .saturation(0.8)
    })
  event.create('soul_spaghetti')
    .displayName('Soul Spaghetti')
    .texture('thecatlord:item/food/soul_spaghetti')
    .food(food => {
      food
        .nutrition(12)
        .saturation(0.8)
        .effect('farmersdelight:nourishment', 3600, 0, 1.0)
    })
})
