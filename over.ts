import { Batsman } from "."

/**
 * An over.
 */
export class Over {

    private first_batsman_score = Array<number>(6).fill(0)
    private second_batsman_score = Array<number>(6).fill(0)


    /**
     * Set the score on a specific ball in the over.
     * @param batsman Which batsman to add a score to (first/second)
     * @param ball Which ball to add a score to (1-6)
     * @param score The score to add
     */
    setScore(batsman: Batsman, ball: number, score: number) {

        ball = ball - 1

        if (ball < 0 || ball > 5) {
            throw "Ball number out of bounds (over only has 1-6 balls, not " + (ball + 1) + ")"
        }

        switch(batsman) {
            case Batsman.first:
                this.first_batsman_score[ball] = score
                break
            case Batsman.second:
                this.second_batsman_score[ball] = score
        }


    }

    /**
     * Get the total amount of runs in the over, either overall or per batsman.
     * @param batsman Which batsman (first/second) to get the runs of. Leave empty for total runs
     * @returns The amount of runs in the over
     */
    getTotalRuns(batsman?: Batsman) {

        var score = 0

        switch(batsman) {
            case undefined:
                this.first_batsman_score.forEach((v) => {
                    score += v
                })
                this.second_batsman_score.forEach((v) => {
                    score += v
                })
                break
            case Batsman.first:
                this.first_batsman_score.forEach((v) => {
                    score += v
                })
                break
            case Batsman.second:
                this.second_batsman_score.forEach((v) => {
                    score += v
                })
                break
        }

        return score
    }


    /**
     * Get the total bowler score in the over
     * @returns The bowler's score
     */
    getTotalBowlerScore() {
        return this.getTotalRuns() / -1
    }

}