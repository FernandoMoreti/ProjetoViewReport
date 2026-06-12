import { Request, Response } from 'express';
import ValidatorService from '../service/ValidatorService';

class ValidatorController {

    async mapperUpload(req: Request, res: Response) {
        try {

            const files = req.files as { [fieldname: string]: Express.Multer.File[] }
            const file = files?.['file'] ? files['file'][0] : undefined;
            const filePaste = files?.['filePaste'] ? files['filePaste'][0] : undefined;

            const { initialDate, finalDate } = req.body

            if (!file || !filePaste || !initialDate || !finalDate) {
                throw new Error("file not received or date not received")
            }

            const response = await ValidatorService.mapperUpload(file, filePaste, initialDate, finalDate)

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