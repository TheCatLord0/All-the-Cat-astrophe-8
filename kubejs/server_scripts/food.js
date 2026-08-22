ItemEvents.foodEaten('kubejs:soul_spaghetti', event => {
    event.player.give('minecraft:bowl')
})  
ServerEvents.recipes(event => {
const spirit = [
    'occultism:soul_shattered',
    'eidolon_repraised:soul_shard'
] 
    spirit.forEach (ingredient => {
        event.recipes.create.milling('4x kubejs:powdered_soul', ingredient)
    })
    Ingredient.of('#malum:spirits').itemIds.forEach(ingredient => {
        event.recipes.create.milling('kubejs:powdered_soul', ingredient)
    })
    event.recipes.create.splashing('kubejs:soul_dough', 'kubejs:powdered_soul')
    event.recipes.farmersdelight.cutting(
        'kubejs:soul_dough', // input
        '#c:tools/knife', // tool
        [ // results
            "kubejs:soul_pasta",
        ],
    )
    event.recipes.farmersdelight.cooking(
        "meals", // recipe book tab - valid values: meals, drinks, misc
        ["minecraft:beef","minecraft:beef","minecraft:beef","kubejs:powdered_soul"],
        "kubejs:soul_sausage", // output
        30, // exp
        10, // cookTime
        // "minecraft:bowl" // container
    )
    event.recipes.farmersdelight.cooking(
        "meals", // recipe book tab - valid values: meals, drinks, misc
        ["kubejs:soul_pasta","kubejs:soul_sausage","kubejs:powdered_soul"],
        "kubejs:soul_spaghetti", // output
        30, // exp
        10, // cookTime
        "minecraft:bowl" // container
    )
    event.shaped(
    'kubejs:soul_crust', // arg 1: output
    [
        'SMS',
        ' S ', // arg 2: the shape (array of strings)
    ],
      {
        S: 'kubejs:powdered_soul',
        M: 'minecraft:milk_bucket'
      }
    )
    event.shapeless(
    'kubejs:soul_pie', // arg 1: output
    [
        'kubejs:soul_crust',
        'minecraft:sugar', 	       // arg 2: the array of inputs
        'minecraft:egg'
      ]
    )
})