function collision({ object1, object2 }) {
    return (
      object1.position.y + object1.height >= object2.position.y &&
      object1.position.y <= object2.position.y + object2.height &&
      object1.position.x <= object2.position.x + object2.width &&
      object1.position.x + object1.width >= object2.position.x
    )
  }

  function platformCollisions({ object1, object2 }) {
    return (
      object1.position.y + object1.height >= object2.position.y &&
      object1.position.y + object1.height <= object2.position.y + object2.height &&
      object1.position.x <= object2.position.x + object2.width &&
      object1.position.x + object1.width >= object2.position.x
    )
  }

  function objCollisions({ object1, object2,offset}) {
    return (
      object2.active &&
      object1.position.y + object1.height >= object2.position.y+offset &&
      object1.position.y <= object2.position.y + object2.height &&
      object1.position.x <= object2.position.x + object2.width &&
      object1.position.x + object1.width >= object2.position.x
    )
  }

  function enemyCollisions({ player, enemy}) { 
    return (
      enemy.active &&
      player.position.y + player.height >= enemy.hitbox.position.y &&
      player.position.y <= enemy.hitbox.position.y + enemy.hitbox.height &&
      player.position.x <= enemy.hitbox.position.x + enemy.hitbox.width &&
      player.position.x + player.width >= enemy.hitbox.position.x
    )
  }