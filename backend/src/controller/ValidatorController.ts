import { Request, Response } from 'express';
import ValidatorService from '../service/ValidatorService';

class ValidatorController {

    async mapperUpload(req: Request, res: Response) {
        try {

            const file = req.file
            const { initialDate, finalDate } = req.body

            if (!file || !initialDate || !finalDate) {
                throw new Error("file not received or date not received")
            }

            const response = await ValidatorService.mapperUpload(file, initialDate, finalDate)

            res.status(200).json({
                reportsByBank: response?.grupos,
                min: response?.minExpected,
                max: response?.maxExpected,
                expected: response?.expectedByBank
            })
        } catch (e) {
            console.error(e)
        }
    }
}

export default new ValidatorController();