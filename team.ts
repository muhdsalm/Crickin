import { Batsman } from "."
import { Player } from './player';

/**
 * A team of players.
 */
export class Team {

    private name = ""
    private player_array = Array<Player | null>(8).fill(null)
    private batting: boolean | undefined = undefined
    private team_score = 0

    private selectedBatsmen: Player[] = []
    private selectedBowler: Player | undefined = undefined

    private man_of_the_match: Player | undefined = undefined
    private best_batsman: Player | undefined = undefined
    private best_bowler: Player | undefined = undefined
    
    /**
     * 
     * @param name The name of the team
     * @param playerNameArray An array of the names of the players. Must only contain 6 or 8 names
     */
    constructor(name: string, playerNameArray: string[]) {
        this.name = name
        if (playerNameArray.length != 6 && playerNameArray.length != 8) {
            throw "'playerNamesList' can only contain 6 or 8 names." 
        }
        
        playerNameArray.forEach((v, i) => {
            this.player_array[i] = new Player(v)
        })

    }


    /**
     * 
     * @returns The team's name
     */
    getName() {
        return this.name
    }

    /**
     * 
     * @param index The index of the player to get
     * @returns The player at the specified index
     */
    getPlayer(index: number) {
        return this.player_array[index]
    }

    /**
     * This team should bat (set to batting mode)
     */
    bat() {
        this.batting = true
    }

    /**
     * This team should bowl (set to bowling mode)
     */
    bowl() {
        this.batting = false
    }

    /**
     * Select the players who will play. Works for both bowling and batting.
     * @param firstIndex The first person who will bat, or the person who will bowl
     * @param secondIndex The second person who will bat. Leave empty for bowling
     * @param overNumber The total number of overs in this match. Leave empty for batting
     */
    selectPlayers(firstIndex: number, secondIndex?: number, overNumber?: number) {
        if (this.batting) {
            if (secondIndex == undefined) {
                throw "No second batsman specified"
            }
            if (firstIndex == secondIndex) {
                throw "Same batsman selected twice"
            }

            this.selectedBatsmen = [this.player_array[firstIndex]!, this.player_array[secondIndex]!]
            if (this.selectedBatsmen[0].hasBat() || this.selectedBatsmen[1].hasBat()) {
                throw "Selected player(s) have already bat"
            }
            this.selectedBatsmen[0].bat()
            this.selectedBatsmen[1].bat()
        } else {

            if (overNumber == undefined) {
                throw "Total number of overs not specified"
            }

            this.selectedBowler = this.player_array[firstIndex]!
            if (this.selectedBowler.hasBowled(overNumber!)) {
                throw "Selected player has already bowled"
            }
            this.selectedBowler.bowl()
        }
    }

    /**
     * Get the remaining player available to play.
     * @param overNumber The total number of overs. Only required while bowling
     */
    getRemainingPlayers(overNumber?: number) {
        var availablePlayers: [number, string][] = []
        if (this.batting) {
            this.player_array.forEach((v, i) => {
                if (!v?.hasBat()) {
                    availablePlayers.push([i, v?.getName()!])
                }
            })
        } else {
            this.player_array.forEach((v, i) => {
                if (!v?.hasBowled(overNumber!)) {
                    availablePlayers.push([i, v?.getName()!])
                }
            })
        }

        return availablePlayers
    }

    /**
     * Add score to the player and the team. This means runs/wickets for a batsman (positive for runs and negative for wickets) or a bowler (positive for wickets and negative for runs)
     * @param score The score/runs to add
     * @param batsman If the team is batting, which batsman (first/second)
     */
    score(score: number, batsman?: Batsman, ) {
        if (this.batting) {
            if (batsman == undefined) {
                throw "No batsman specified"
            }
            this.selectedBatsmen[batsman].addBattingRuns(score)
        } else {
            this.selectedBowler?.addBowlingScore(score)
        }
        this.team_score += score
    }

    private calculate_everything_for_the_end() {
        if (this.man_of_the_match == undefined || this.best_batsman == undefined || this.best_bowler == undefined) {
            var MOM_runs = 0
            var MOM_index = 0

            var BBat_runs = 0
            var BBat_index = 0

            var BBowl_runs = 0
            var BBowl_index = 0

            this.player_array.forEach((v, i) => {
                if (v?.getTotalScore()! > MOM_runs) {
                    MOM_index = i
                    MOM_runs = v?.getTotalScore()!
                }
                if (v?.getBattingScore()! > BBat_runs) {
                    BBat_index = i
                    BBat_runs = v?.getBattingScore()!
                }
                if (v?.getBowlingScore()! > BBowl_runs) {
                    BBowl_index = i
                    BBat_runs = v?.getBowlingScore()!
                }
            })

            this.man_of_the_match = this.player_array[MOM_index]!
            this.best_batsman = this.player_array[BBat_index]!
            this.best_bowler = this.player_array[BBowl_index]!
        }
    }

    manOfTheMatch() {
        this.calculate_everything_for_the_end()
        return this.man_of_the_match
    }

    bestBatsman() {
        this.calculate_everything_for_the_end()
        return this.best_batsman
    }

    bestBowler() {
        this.calculate_everything_for_the_end()
        this.best_bowler
    }


}