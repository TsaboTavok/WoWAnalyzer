import React from 'react';
import Analyzer from 'parser/core/Analyzer';
import SPELLS from 'common/SPELLS/index';
import { formatNumber } from 'common/format';
import TalentStatisticBox from 'interface/others/TalentStatisticBox';
import STATISTIC_ORDER from 'interface/others/STATISTIC_ORDER';
import calculateEffectiveDamage from 'parser/core/calculateEffectiveDamage';

const PERCENT_BUFF = 0.20;

//WCL: https://www.warcraftlogs.com/reports/JxyY7HCDcjqMA9tf/#fight=1&source=15
class AgonizingFlames extends Analyzer {

  damage = 0;


  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasTalent(SPELLS.AGONIZING_FLAMES_TALENT.id);
  }

  on_byPlayer_damage(event) {
    const spellID = event.ability.guid;
    if (spellID !== SPELLS.IMMOLATION_AURA_FIRST_STRIKE.id && spellID !== SPELLS.IMMOLATION_AURA_BUFF.id) {
      return;
    }
        this.damage += calculateEffectiveDamage(event, PERCENT_BUFF);
    }



  statistic() {
    return (
      <TalentStatisticBox
        talent={SPELLS.AGONIZING_FLAMES_TALENT.id}
        position={STATISTIC_ORDER.CORE(9)}
        value={this.owner.formatItemDamageDone(this.damage)}
        tooltip={<>This shows the extra dps that the talent provides.<br /><strong>Total extra damage:</strong> {formatNumber(this.damage)}</>}
      />
    );
  }
}

export default AgonizingFlames;
