const { Positions } = require('../utils/db');

exports.addPositions = (data) => {
    const position = new Positions(data)
    return position.save();
}

exports.list = () => {
    return Positions.find().sort({ _id: -1 });
}

exports.removePositions = (id) => {
    return Positions.deleteOne({ _id: id });
}

exports.updatePositions = (data) => {
    return Positions.findByIdAndUpdate(data.id,data);
}

exports.listOne = (id)=>{
    return Positions.findOne({ _id: id });
}
