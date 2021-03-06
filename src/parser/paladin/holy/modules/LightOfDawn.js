import React from 'react';
import { Trans } from '@lingui/macro';

import SPELLS from 'common/SPELLS';
import { STATISTIC_ORDER } from 'interface/others/StatisticBox';
import Statistic from 'interface/statistics/Statistic';
import BoringSpellValue from 'interface/statistics/components/BoringSpellValue';
import PlayerHits from 'interface/statistics/components/PlayerHits';
import Analyzer, { SELECTED_PLAYER } from 'parser/core/Analyzer';
import Events from 'parser/core/Events';

import './LightOfDawn.scss';

class LightOfDawn extends Analyzer {
  _casts = 0;
  _heals = 0;
  constructor(props) {
    super(props);
    this.addEventListener(Events.cast.by(SELECTED_PLAYER).spell(SPELLS.LIGHT_OF_DAWN_CAST), this._onCast);
    this.addEventListener(Events.heal.by(SELECTED_PLAYER).spell(SPELLS.LIGHT_OF_DAWN_HEAL), this._onHeal);
  }

  _onCast(event) {
    this._casts += 1;
  }
  _onHeal(event) {
    this._heals += 1;
  }

  statistic() {
    const playersHitPerCast = (this._heals / this._casts) || 0;
    const performance = playersHitPerCast / 5;

    return (
      <Statistic
        position={STATISTIC_ORDER.CORE(60)}
        size="small"
      >
        <BoringSpellValue
          spell={SPELLS.LIGHT_OF_DAWN_CAST}
          value={playersHitPerCast.toFixed(2)}
          label={<Trans>Average targets hit per cast</Trans>}
          className="light-of-dawn-hits-per-cast"
          extra={<PlayerHits performance={performance} />}
        />
      </Statistic>
    );
  }
}

export default LightOfDawn;
