const Contest = require('./../contest/contest_model');

const winnings = async (req, res) => {
    try {
        const match_id = req.query.match_id;
        const contest_id = req.query.contest_id;
        if(!match_id && !contest_id) {
            return res.status(400).json({
                status: 0,
                message: 'match_id and contest_id are required'
            })
        }

        const contest = await Contest.findOne({match_id, contest_id});
        console.log(contest);

        if(!contest){return res.status(404).json({status: 0, message: 'data not found according to inputs'})};
        let Data = []
        Data.push({
            prize_pool: contest.prize_pool,
            sports: contest.contest_size,
            entry_fee: contest.entry_fee,
            rank: contest.rank,
            winnings: contest.winnings_amount,
        })
        return res.status(200).json({
            status: 1,
            data: Data,
        })        
    } catch (error) {
        res.status(500).json({
            status: 0,
            message: error.message
        })  
    }
}

module.exports = {winnings};