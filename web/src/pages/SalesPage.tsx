import { useEffect, useState } from 'react';
import {
    Box, Typography, Button, Paper, TextField, Dialog, DialogTitle,
    DialogContent, DialogActions, Autocomplete,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import api from '../api';

export default function SalesPage() {
    const [sales, setSales] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [open, setOpen] = useState(false);

    // Basic form state
    const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
    const [quantity, setQuantity] = useState('1');

    const fetchData = async () => {
        const [salesRes, productsRes] = await Promise.all([
            api.get('/sales'),
            api.get('/products')
        ]);
        setSales(salesRes.data);
        setProducts(productsRes.data);
    };

    useEffect(() => { fetchData(); }, []);

    const handleCreateSale = async () => {
        if (!selectedProduct) return;
        const qty = parseInt(quantity);
        const amount = selectedProduct.price * qty;

        await api.post('/sales', {
            shopId: 'default-shop', // In real app, derived from auth
            totalAmount: amount,
            details: {
                create: [
                    {
                        productId: selectedProduct.id,
                        quantity: qty,
                        price: selectedProduct.price,
                    }
                ]
            }
        });

        setOpen(false);
        fetchData();
    };

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" fontWeight={700}>Sales</Typography>
                <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>
                    New Sale
                </Button>
            </Box>

            <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse' }}>
                    <Box component="thead" sx={{ bgcolor: '#f5f5f5' }}>
                        <Box component="tr">
                            <Box component="th" sx={{ p: 2, textAlign: 'left' }}>Sale ID</Box>
                            <Box component="th" sx={{ p: 2, textAlign: 'left' }}>Date</Box>
                            <Box component="th" sx={{ p: 2, textAlign: 'right' }}>Total Amount</Box>
                        </Box>
                    </Box>
                    <Box component="tbody">
                        {sales.map((sale) => (
                            <Box component="tr" key={sale.id} sx={{ '&:hover': { bgcolor: '#fafafa' } }}>
                                <Box component="td" sx={{ p: 2 }}>{sale.id}</Box>
                                <Box component="td" sx={{ p: 2 }}>{new Date(sale.createdAt).toLocaleDateString()}</Box>
                                <Box component="td" sx={{ p: 2, textAlign: 'right' }}>${sale.totalAmount.toFixed(2)}</Box>
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Paper>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>New Sale</DialogTitle>
                <DialogContent>
                    <Autocomplete
                        options={products}
                        getOptionLabel={(option) => `${option.name} ($${option.price})`}
                        value={selectedProduct}
                        onChange={(_, newValue) => setSelectedProduct(newValue)}
                        renderInput={(params) => <TextField {...params} label="Select Product" margin="normal" />}
                    />
                    <TextField
                        label="Quantity"
                        type="number"
                        fullWidth
                        margin="normal"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                    />
                    {selectedProduct && (
                        <Typography variant="h6" align="right" mt={2}>
                            Total: ${(selectedProduct.price * parseInt(quantity || '0')).toFixed(2)}
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleCreateSale} disabled={!selectedProduct}>
                        Confirm Sale
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
