class Entity {
  owner = null;
  constructor(owner) {
    this.owner = owner;
  }

  /**
   * This also tracks debuffs in the exact same array. There are no parameters to filter results by debuffs. I don't think this should be necessary as debuffs and buffs usually have different spell IDs.
   */

  buffs = [];

  /**
   * @param {number} timestamp - Timestamp (in ms) to be considered, or the current timestamp if null. Won't work right for timestamps after the currentTimestamp.
   * @param {number} bufferTime - Time (in ms) after buff's expiration where it will still be included. There's a bug in the combat log where if a spell consumes a buff that buff may disappear a short time before the heal or damage event it's buffing is logged. This can sometimes go up to hundreds of milliseconds.
   * @param {number} minimalActiveTime - Time (in ms) the buff must have been active before timestamp for it to be included.
   * @returns {function} The buffs within the time period.
   */
  static activeAtTimestampFilter(timestamp, bufferTime = 0, minimalActiveTime = 0) {
    return buff => (timestamp - minimalActiveTime) >= buff.start && (buff.end === null || (buff.end + bufferTime) >= timestamp);
  }
  static spellIdFilter(spellId) {
    const nSpellId = Number(spellId);
    return buff => buff.ability.guid === nSpellId;
  }
  static sourceIdFilter(sourceID) {
    if (sourceID === null) {
      return () => true;
    }
    return buff => buff.sourceID === sourceID;
  }

  activeBuffs(forTimestamp = null, bufferTime = 0, minimalActiveTime = 0) {
    const currentTimestamp = forTimestamp !== null ? forTimestamp : this.owner.currentTimestamp;
    return this.buffs.filter(this.constructor.activeAtTimestampFilter(currentTimestamp, bufferTime, minimalActiveTime));
  }

  /**
   * @param {number} spellId buff ID to check for
   * @param {number} forTimestamp Timestamp (in ms) to be considered, or the current timestamp if null. Won't work right for timestamps after the currentTimestamp.
   * @param {number} bufferTime Time (in ms) after buff's expiration where it will still be included. There's a bug in the combat log where if a spell consumes a buff that buff may disappear a short time before the heal or damage event it's buffing is logged. This can sometimes go up to hundreds of milliseconds.
   * @param {number} minimalActiveTime - Time (in ms) the buff must have been active before timestamp for it to be included.
   * @param {number} sourceID - source ID the buff must have come from, or any source if null
   * @returns {boolean} - Whether the buff is present with the given specifications.
   */
  hasBuff(spellId, forTimestamp = null, bufferTime = 0, minimalActiveTime = 0, sourceID = null) {
    return this.getBuff(spellId, forTimestamp, bufferTime, minimalActiveTime, sourceID) !== undefined;
  }

  /**
   * @param {number} spellId - buff ID to check for
   * @param {number} forTimestamp Timestamp (in ms) to be considered, or the current timestamp if null. Won't work right for timestamps after the currentTimestamp.
   * @param {number} bufferTime Time (in ms) after buff's expiration where it will still be included. There's a bug in the combat log where if a spell consumes a buff that buff may disappear a short time before the heal or damage event it's buffing is logged. This can sometimes go up to hundreds of milliseconds.
   * @param {number} minimalActiveTime - Time (in ms) the buff must have been active before timestamp for it to be included.
   * @param {number} sourceID - source ID the buff must have come from, or any source if null.
   * @returns {Object} - A buff with the given specifications. The buff object will have all the properties of the associated applybuff event, along with a start timestamp, an end timestamp if the buff has fallen, and an isDebuff flag. If multiple buffs meet the specifications, there's no guarantee which you'll get (this could happen if multiple spells with the same spellId but from different sources are on the same target)
   */
  getBuff(spellId, forTimestamp = null, bufferTime = 0, minimalActiveTime = 0, sourceID = null) {
    const currentTimestamp = forTimestamp !== null ? forTimestamp : this.owner.currentTimestamp;
    const isCorrectSpell = this.constructor.spellIdFilter(spellId);
    const isActive = this.constructor.activeAtTimestampFilter(currentTimestamp, bufferTime, minimalActiveTime);
    const isCorrectSource = this.constructor.sourceIdFilter(sourceID);
    return this.buffs.find(buff => isCorrectSpell(buff) && isActive(buff) && isCorrectSource(buff));
  }

  /**
   * @param {number} spellId - buff ID to check for
   * @param {number} sourceID - source ID the buff must have come from, or any source if null.
   * @returns {array} The buff activations.
   */
  getBuffHistory(spellId, sourceID = null) {
    const isCorrectSpell = this.constructor.spellIdFilter(spellId);
    const isCorrectSource = this.constructor.sourceIdFilter(sourceID);
    return this.buffs.filter(buff => isCorrectSpell(buff) && isCorrectSource(buff));
  }
  /**
   * @param {number} spellId - buff ID to check for
   * @param {number} sourceID - source ID the buff must have come from, or any source if null.
   * @returns {number} - Time (in ms) the specified buff has been active.
   */
  getBuffUptime(spellId, sourceID = null) {
    return this.getBuffHistory(spellId, sourceID)
      .reduce((uptime, buff) => uptime + (buff.end !== null ? buff.end : this.owner.currentTimestamp) - buff.start, 0);
  }
  /**
   * @param {number} spellId - buff ID to check for
   * @param {number|null} sourceID - source ID the buff must have come from, or any source if null.
   * @returns {number} - The number of times the specified buff has been applied (only applications count, not stack changes or refreshes).
   */
  getBuffTriggerCount(spellId, sourceID = null) {
    return this.getBuffHistory(spellId, sourceID).length;
  }
  /**
   * @param {number} spellId - buff ID to check for
   * @param {number|null} sourceID - source ID the buff must have come from, or any source if null.
   * @returns {number} - Time (in ms) the specified buff has been active weighted by the number of stacks active.
   *      For example if buff was up for 10000ms with 1 stack and 20000ms with 2 stacks, would return 50000.
   */
  getStackWeightedBuffUptime(spellId, sourceID = null) {
    return this.getBuffHistory(spellId, sourceID)
      .reduce((totalUptime, buff) => {
        let startTime;
        let startStacks;
        const buffUptime = buff.stackHistory.reduce((stackUptime, stack, idx, arr) => {
          let result = !startTime ? 0 : (stack.timestamp - startTime) * startStacks;
          startTime = stack.timestamp;
          startStacks = stack.stacks;
          if (buff.end === null && idx === arr.length - 1) {
            // If the buff instance didn't end (usually because it was still active at the end of the fight) we need to manually account for it
            const finalStackUptime = this.owner.currentTimestamp - startTime;
            const weighted = finalStackUptime * startStacks;
            result += weighted;
          }
          return stackUptime + result;
        }, 0);
        return totalUptime + buffUptime;
      }, 0);
  }
  applyBuff(buff) {
    this.buffs.push({
      end: null,
      stackHistory: [{ stacks: 1, timestamp: buff.timestamp }],
      stacks: 1,
      ...buff,
    });
  }
}

export default Entity;
