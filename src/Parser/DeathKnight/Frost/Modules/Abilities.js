import React from 'react';

import SPELLS from 'common/SPELLS';
import ITEMS from 'common/ITEMS';
import SpellLink from 'common/SpellLink';

import CoreAbilities from 'Parser/Core/Modules/Abilities';

class Abilities extends CoreAbilities {
  spellbook() {
    const combatant = this.selectedCombatant;
    return [
      {
        spell: SPELLS.SINDRAGOSAS_FURY_ARTIFACT,
        category: Abilities.SPELL_CATEGORIES.COOLDOWNS,
        gcd: true,
        cooldown: 300,
        castEfficiency: {
          suggestion: true,
          recommendedEfficiency: 0.90,
          extraSuggestion: <React.Fragment>Although you normally want to use this off CD, you can save it to line it up with <SpellLink id={SPELLS.PILLAR_OF_FROST.id} icon />.  You can also hold it if you know there will be an opportunity to hit more than one enemy in the next 30 seconds.</React.Fragment>,
        },
      },
      {
        spell: SPELLS.OBLITERATION_TALENT,
        category: Abilities.SPELL_CATEGORIES.COOLDOWNS,
        gcd: false,
        cooldown: 90,
        enabled: combatant.hasTalent(SPELLS.OBLITERATION_TALENT.id),
        castEfficiency: {
          suggestion: true,
          recommendedEfficiency: 0.90,
          extraSuggestion: 'Only save it if you are about to move and will waste more than half the duration.',
        },
      },
      {
        spell: SPELLS.BREATH_OF_SINDRAGOSA_TALENT,
        category: Abilities.SPELL_CATEGORIES.COOLDOWNS,
        gcd: false,
        cooldown: 120,
        enabled: combatant.hasTalent(SPELLS.BREATH_OF_SINDRAGOSA_TALENT.id),
        castEfficiency: {
          suggestion: true,
          recommendedEfficiency: 0.90,
          extraSuggestion: 'You should only save this if you are about to move and would immediately lose the breath.',
        },
      },
      {
        spell: SPELLS.PILLAR_OF_FROST,
        category: Abilities.SPELL_CATEGORIES.COOLDOWNS,
        gcd: false,
        cooldown: 60,
        castEfficiency: {
          suggestion: true,
          recommendedEfficiency: 0.90,
          extraSuggestion: 'You should aim to use this off CD.  Only save it if you are about to move and will waste more than half the duration.',
        },
      },
      {
        spell: SPELLS.EMPOWER_RUNE_WEAPON,
        gcd: false,
        category: Abilities.SPELL_CATEGORIES.COOLDOWNS,
        cooldown: 180,
        castEfficiency: {
          suggestion: true,
          recommendedEfficiency: 0.60,
          extraSuggestion: <React.Fragment>You should use this whenever you are out of Runes and Runic Power.  Alternatively, some players use this during heroism to get more casts of <SpellLink id={SPELLS.OBLITERATE_CAST.id} />.</React.Fragment>,
        },
      },
      {
        spell: SPELLS.HUNGERING_RUNE_WEAPON_TALENT,
        category: Abilities.SPELL_CATEGORIES.COOLDOWNS,
        gcd: false,
        cooldown: 180,
        enabled: combatant.hasTalent(SPELLS.HUNGERING_RUNE_WEAPON_TALENT.id),
        castEfficiency: {
          suggestion: true,
          recommendedEfficiency: 0.90,
        },
      },
      {
        spell: SPELLS.OBLITERATE_CAST,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        gcd: true,
      },
      {
        spell: SPELLS.REMORSELESS_WINTER,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        gcd: true,
        cooldown: 20,
        castEfficiency: {
          suggestion: true,
          recommendedEfficiency: 0.90,
        },
      },
      {
        spell: SPELLS.FROST_STRIKE_CAST,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        gcd: true,
      },
      {
        spell: SPELLS.HOWLING_BLAST,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        gcd: true,
      },
      {
        spell: SPELLS.FROSTSCYTHE_TALENT,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        gcd: true,
        enabled: combatant.hasTalent(SPELLS.FROSTSCYTHE_TALENT.id),
      },
      {
        spell: SPELLS.GLACIAL_ADVANCE_TALENT,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        cooldown: 6,
        gcd: true,
        enabled: combatant.hasTalent(SPELLS.GLACIAL_ADVANCE_TALENT.id),
      },
      {
        spell: SPELLS.BLINDING_SLEET_TALENT,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        cooldown: 60,
        gcd: true,
        enabled: combatant.hasTalent(SPELLS.BLINDING_SLEET_TALENT.id),
      },
      {
        spell: SPELLS.HORN_OF_WINTER_TALENT,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        gcd: true,
        cooldown: 45,
        enabled: combatant.hasTalent(SPELLS.HORN_OF_WINTER_TALENT.id),
        castEfficiency: {
          suggestion: true,
          recommendedEfficiency: 0.90,
        },
      },
      {
        spell: SPELLS.CHAINS_OF_ICE,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        gcd: true,
        cooldown: 40,
        enabled: combatant.hasChest(ITEMS.COLD_HEART.id),
        castEfficiency: {
          suggestion: true,
          recommendedEfficiency: 0.90,
          extraSuggestion: <span>You should be casting Chains of Ice whenever you have 20 stacks of <SpellLink id={SPELLS.COLD_HEART_BUFF.id} />.</span>,
        },
      },
      {
        spell: SPELLS.ICEBOUND_FORTITUDE,
        buffSpellId: SPELLS.ICEBOUND_FORTITUDE.id,
        category: Abilities.SPELL_CATEGORIES.DEFENSIVE,
        cooldown: 180,
        gcd: false,
      },
      {
        spell: SPELLS.ANTI_MAGIC_SHELL,
        buffSpellId: SPELLS.ANTI_MAGIC_SHELL.id,
        category: Abilities.SPELL_CATEGORIES.DEFENSIVE,
        cooldown: 60,
        gcd: false,
      },
      {
        spell: SPELLS.DARK_COMMAND,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        cooldown: 8,
        gcd: true,
      },
      {
        spell: SPELLS.DEATH_STRIKE,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        gcd: true,
      },
      {
        spell: SPELLS.CONTROL_UNDEAD,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        gcd: true,
      },
      {
        spell: SPELLS.RAISE_ALLY,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        gcd: true,
        cooldown: 600,
      },
      {
        spell: SPELLS.WRAITH_WALK,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        gcd: true,
        cooldown: 60,
      },
      {
        spell: SPELLS.DEATH_GRIP,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        gcd: false,
        cooldown: 25,
      },
      {
        spell: SPELLS.MIND_FREEZE,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        gcd: false,
        cooldown: 15,
      },
      {
        spell: SPELLS.RUNE_1,
        category: Abilities.SPELL_CATEGORIES.HIDDEN,
        cooldown: haste => 10 / (1 + haste),
        charges: 2,
      },

      {
        spell: SPELLS.RUNE_2,
        category: Abilities.SPELL_CATEGORIES.HIDDEN,
        cooldown: haste => 10 / (1 + haste),
        charges: 2,
      },

      {
        spell: SPELLS.RUNE_3,
        category: Abilities.SPELL_CATEGORIES.HIDDEN,
        cooldown: haste => 10 / (1 + haste),
        charges: 2,
      },
    ];
  }
}

export default Abilities;