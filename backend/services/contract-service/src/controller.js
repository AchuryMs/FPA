const express = require('express');
const router = express.Router();
const { ContractService } = require('./domain');
const { MySQLContractsRepository } = require('./mysql_infrastructure');
const contractService = new ContractService(new MySQLContractsRepository());


router.get('/test', (req, res) => {
  res.json({ message: 'Contract service funcionando (controller).' });
});

router.post('/contracts', async (req, res) => {
    const { id } = req.body;
    try {
        const currentContracts = await contractService.getContracts(id);
        res.json(currentContracts);
    } catch (error) {
        console.error('Error fetching contracts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

});

router.get('/validate', async (req, res) => {
    const { investor } = req.query;
    try {
        const contract = await contractService.validateContract(investor);
        if (!contract) {
            return res.status(404).json({ error: 'Contract not found' });
        }
        res.json({ contract });
    } catch (error) {
        console.error('Error validating contract:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;

