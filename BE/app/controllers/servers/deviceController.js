const Device = require("../../models/Device");
const Home = require("../../models/Home");
class deviceController {
    // POST localhost:[port]/api/device/register
    async register(req, res, next) {
        try {
            Home.findById(req.params.hid)
                .then((home) => {
                    if (home.user_id_list == req.params.uid) {
                        return home;
                    } else {
                        throw new Error("You are not a member of the house");
                    }
                })
                .then((home) => {
                    const device = new Device({
                        device_owner: req.params.uid,
                        home_id: req.params.hid,
                        mac_address: req.body.mac_address,
                        device_name: req.body.device_name,
                        device_status: {
                            type: req.body.device_type,
                            code: req.body.device_code,
                        },
                        device_online: false,
                    });
                    return device.save();
                })
                .then(() => {
                    // You can perform additional actions after saving the device here
                    return res.status(200).send("Create device successfully");
                })
                .catch((err) => {
                    console.error("Error:", err.message);
                    return res.status(400).send(err.message || "New creation failed");
                });
        } catch (error) {
            return res.status(400).json({
                errCode: 1,
                errMessaging: "Missing Param",
            });
        }
    }

    async checkUserFromHome(userId, homeId) {
        try {
            const home = await Home.findById(homeId);
            return home && home.user_id_list.includes(userId);
        } catch (error) {
            throw new Error("Error checking user from home");
        }
    }

    // POST localhost:[port]/api/:uid/device/:did
    async viewDetail(req, res, next) {
        try {
            const hasPermission = await this.checkUserFromHome(req.params.uid, req.params.hid);
            if (hasPermission) {
                const device = await Device.findOne({ home_id: req.params.hid, _id: req.params.did });
                if (!device) {
                    return res.status(401).send("Your user doesn't have a device");
                }
                return res.status(200).json(device);
            } else {
                return res.status(400).send("Permission denied");
            }
        } catch (error) {
            return res.status(500).send("Internal Server Error");
        }
    }


    // POST localhost:[port]/api/device/:uid/:hid
    async view(req, res, next) {
        try {
            const home = await Home.findById(req.params.hid);
            if (home && home.user_id_list.includes(req.params.uid)) {
                const devices = await Device.find({ home_id: req.params.hid });
                if (!devices || devices.length === 0) {
                    return res.status(401).send("Your user doesn't have a device");
                }
                return res.status(200).json(devices);
            } else {
                return res.status(400).send("Permission denied");
            }
        } catch (error) {
            console.log(error, "error");
            return res.status(500).send("Internal Server Error");
        }
    }

    async checkHomeOwnerPermission(userId, homeId) {
        return Home.findById(homeId)
            .then((home) => {
                if (home.owner == userId) {
                    return Device.findByIdAndDelete(req.params.did);
                } else {
                    throw new Error("Permission denied");
                }
            });
    }

    async delete(req, res) {
        try {
            Device.findById(req.params.did)
                .then((device) => {
                    if (device.device_owner == req.params.uid) {
                        return Device.findByIdAndDelete(req.params.did);
                    } else {
                        return checkHomeOwnerPermission(req.params.uid, req.params.hid);
                    }
                })
                .then(() => {
                    res.status(200).json("Delete Successfully!");
                })
                .catch((error) => {
                    res.status(400).json(error.message || "Delete failed");
                });
        } catch (error) {
            return res.status(500).json(error.message || "Internal Server Error");
        }
    }

    async edit(req, res) {
        console.log(req.body, "req.body");
        Device.updateOne({ _id: req.params.did }, req.body)
            .then(async () => {
                res.status(200).json("Update Successfully!");
            })
            .catch(error => {
                return res.status(500).json(error);
            })
    }
}

module.exports = new deviceController();
