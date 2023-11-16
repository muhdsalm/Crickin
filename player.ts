/**
 * A player.
 */
export class Player {

    private name = ""

    private has_bat = false
    private has_bowled = [false, false]

    private batting_score = 0
    private bowling_score = 0


    /**
     * 
     * @returns The player's name
     */
    getName() {
        return this.name
    }

    /**
     * Whether or not a player has bat
     */
    hasBat() {
        return this.has_bat
    }

    /**
     * The player has been selected to bat
     */
    bat() {
        this.has_bat = true
    }

    /**
     * Whether or not a player has bowled
     * @param overNumber The total number of overs in this match
     */
    hasBowled(overNumber: number) {

        if (overNumber == 6 || overNumber == 8) {
            return this.has_bowled[0]
        }
        return this.has_bowled[0] && this.has_bowled[1]
    }

    bowl() {
        if (this.has_bowled[0] == true) {
            this.has_bowled[1] = true
        } else {
            this.has_bowled[0] = true
        }
    }

    /**
     * 
     * @returns The player's batting score
     */
    getBattingScore() {
        return this.batting_score
    }

    /**
     * 
     * @returns The player's bowling score
     */
    getBowlingScore() {
        return this.bowling_score
    }

    /**
     * 
     * @returns The player's total score
     */
    getTotalScore() {
        return this.batting_score + this.bowling_score
    }

    /**
     * Add runs / wickets to the player (when the player is a batsman)
     * @param runs The amount of runs. Negative for a wicket
     */
    addBattingRuns(runs: number) {
        this.batting_score += runs
    }
    /**
     * Add a wicket to the player's score (as a bowler)
     * @param score +5 for a wicket. Negative for the batsman's runs
     */
    addBowlingScore(score: number) {
        this.bowling_score += score
    }

    /**
     * 
     * @param name The name of the player
     */
    constructor(name: string) {
        this.name = name
    }



}