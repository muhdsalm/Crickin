import { Batsman } from ".";
import { Over } from "./over";
import { Team } from './team';

export enum TeamNumber {
    One,
    Two
}

export class Game {
    private team1: Team | undefined = undefined
    private team2: Team | undefined = undefined

    private battingTeam: Team | undefined = undefined
    private bowlingTeam: Team | undefined = undefined

    private team1Name: string | undefined = ""
    private team2Name: string | undefined = ""

    private totalOvers: Over[] = []
    private currentOver: Over = new Over()

    private overNumber: number | undefined = undefined
    private currentOverNumber = 0

    private playersSelected = false


    /**
     * Set the teams' names.
     * @param team1Name The name of the first team
     * @param team2Name The name of the second team
     */
    setTeamNames(team1Name: string, team2Name: string) {
        this.team1Name = team1Name
        this.team2Name = team2Name
    }


    /**
     * Set the name of the teams' players. Requires the teams' name to be set first
     * @param team1PlayerNamesList A list of strings containing all the names of the first team
     * @param team2PlayerNamesList A list of strings containing all the names of the second team
     */
    setPlayerNames(team1PlayerNamesList: string[], team2PlayerNamesList: string[]) {

        if (this.team1Name == undefined) {
            throw "Please set the teams' names first"
        }

        this.team1 = new Team(this.team1Name!, team1PlayerNamesList)
        this.team2 = new Team(this.team2Name!, team2PlayerNamesList)

    }

    /**
     * Set the number of overs this game will have.
     * @param overs The number of overs. Can only be 6, 8, 12, or 16
     */
    setOvers(overs: number) {
        if (overs != 6 && overs != 8 && overs != 12 && overs != 16) {
            throw "A match can only have 6, 8, 12, or 16 overs."
        }
        this.overNumber = overs
    }
    /**
     * Get the number of overs in this game
     * @returns The number of overs in this game
     */
    getOverNumber() {
        return this.overNumber
    }

    /**
     * Select which team should bat. Alternatively, use setBowlingTeam()
     * @param team The team that will bat
     */
    setBattingTeam(team: TeamNumber) {
        if (team == TeamNumber.One) {
            this.team1?.bat()
            this.team2?.bowl()
            this.battingTeam = this.team1
            this.bowlingTeam = this.team2
        } else {
            this.team2?.bat()
            this.team1?.bowl()
            this.battingTeam = this.team2
            this.bowlingTeam = this.team1
        }
    }

    /**
     * Select which team should bowl. Alternatively, use setBattingTeam()
     * @param team The team that will bowl
     */
    setBowlingTeam(team: TeamNumber) {
        if (team == TeamNumber.One) {
            this.team1?.bowl()
            this.team2?.bat()
            this.battingTeam = this.team2
            this.bowlingTeam = this.team1
        } else {
            this.team2?.bowl()
            this.team1?.bat()
            this.battingTeam = this.team1
            this.bowlingTeam = this.team2
        }
    }


    /**
     * Get all the remaining players in the game from a team.
     * @param team The team to get the remaining players from
     * @returns The remaining players
     */
    getRemainingPlayers(team: TeamNumber) {
        return team == TeamNumber.One ? this.team1?.getRemainingPlayers(this.overNumber)  : this.team2?.getRemainingPlayers(this.overNumber)
    }
    /**
     * Get the remaining batsmen in the game
     * @returns The remaining batsmen
     */
    getRemainingBatsmen() {
        return this.battingTeam?.getRemainingPlayers()
    }
    /**
     * Get the remaining bowlers in the game
     * @returns The remaining bowlers
     */
    getRemainingBowlers() {
        return this.bowlingTeam?.getRemainingPlayers(this.overNumber)
    }

    /**
     * Get one specific player from one specific team
     * @param team The term to get the player from
     * @param index The index (0-7) of the player to get
     * @returns The player (as a Player)
     */
    getPlayer(team: TeamNumber, index: number) {
        return team == TeamNumber.One ? this.team1?.getPlayer(index) : this.team2?.getPlayer(index)
    }

    /**
     * Select batsmen and bowlers (for the first over only)
     * @param batsman1index The index (0-7) of the player who will be the first batsman
     * @param batsman2Index The index (0-7) of the player who will be the second batsman
     * @param bowlerIndex The index (0-7) of the player who will be the bowler
     */
    selectPlayers(batsman1index: number, batsman2Index: number, bowlerIndex: number) {
        this.battingTeam?.selectPlayers(batsman1index, batsman2Index)
        this.bowlingTeam?.selectPlayers(bowlerIndex, undefined, this.overNumber)
        this.playersSelected = true
    }

    private check_for_proper_initialization() {
        if (this.team1Name == undefined) {
            throw "Please set both teams' names"
        }
        if (this.team1 == undefined) {
            throw "Please set both teams' players' names"
        }
        if (this.overNumber == undefined) {
            throw "Please set the number of overs for this match"
        }
        if (this.battingTeam == undefined) {
            throw "Please select the batting Team"
        }
        if (!this.playersSelected) {
            throw "Please select the opening players"
        }
    }

    batsmenChangeNeeded() {
        if (this.overNumber! > 10) {
            if (this.currentOverNumber % 4 == 0) {
                return true
            }
        } else {
            if (this.currentOverNumber % 2 == 0) {
                return true
            }
        }

        return false

    }
    /**
     * Go to the next over / Start a new over
     * @param nextBowlerIndex The index of the bowler who will bowl the next over
     * @param nextBatsman1Index The index of the first batsman who will bat the next over. Only needed if new batsmen will bowl this over. To find out if a batsman will bat this over, use batsmenChangeNeeded()
     * @param nextBatsman2Index The index of the second batsman who will bat the next over. Only needed if new batsmen will bowl this over. To find out if a batsman will bat this over, use batsmenChangeNeeded()
     */
    newOver(nextBowlerIndex: number, nextBatsman1Index?: number, nextBatsman2Index?: number) {
        this.check_for_proper_initialization()

        this.battingTeam?.score(this.currentOver.getTotalRuns(Batsman.first), Batsman.first)
        this.battingTeam?.score(this.currentOver.getTotalRuns(Batsman.second), Batsman.second)
        this.bowlingTeam?.score(this.currentOver.getTotalBowlerScore())
        
        this.currentOverNumber += 1
        this.totalOvers.push(this.currentOver)
        this.currentOver = new Over()

        if (this.currentOverNumber >= (this.overNumber! - 1)) {
            this.switchTeams()
        }

        this.bowlingTeam?.selectPlayers(nextBowlerIndex, undefined, this.overNumber)

        if (this.batsmenChangeNeeded()) {

            if (nextBatsman1Index == undefined) {
                throw "No batsmen specified to bat the next over"
            }

            this.battingTeam?.selectPlayers(nextBatsman1Index!, nextBatsman2Index)
        }
    }

    /**
     * Set the score on a specific ball in the over.
     * @param batsman Which batsman to add a score to (first/second)
     * @param ball Which ball to add a score to (1-6)
     * @param score The score to add
     */
    setScore(batsman: Batsman, ball: number, score: number) {
        this.check_for_proper_initialization()
        this.currentOver.setScore(batsman, ball, score)
    }

    private switchTeams() {
        this.currentOverNumber = 0
        this.currentOver = new Over()

        this.setBattingTeam(this.battingTeam == this.team1 ? TeamNumber.Two : TeamNumber.One)
    }

    /**
     * Get an over that has already been played and is not currently in play
     * @param index The index of the over
     * @returns The over (as an Over)
     */
    getPreviousOver(index: number) {
        return this.totalOvers[index]
    }

    /**
     * Get the over currently being played
     * @returns The current over (as an Over)
     */
    getCurrentOver() {
        return this.currentOver
    }

    /**
     * Get the team that is currently batting
     * @returns The team that is currently batting (as a Team)
     */
    getBattingTeam() {
        return this.battingTeam
    }


    /**
     * Get the number of the over we are on
     * @returns The number of the over we are on
     */
    getCurrentOverNumber() {
        return this.currentOverNumber
    }

    //TODO: TEST TEST TEST
    
}