export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    type: 'Kemeja' | 'Kain' | 'Dress' | 'Outer';
    motif: string;
    imageUrl: string;
    tokopediaUrl?: string;
    waNumber: string;
}

export const products: Product[] = [
    {
        id: '1',
        name: 'Kemeja Batik Parang Modern',
        description: 'Kemeja batik dengan motif parang kontemporer, potongan slim fit.',
        price: 450000,
        type: 'Kemeja',
        motif: 'Parang',
        imageUrl: 'https://images.unsplash.com/photo-1590736704728-f4730bb30770?auto=format&fit=crop&q=80&w=800',
        tokopediaUrl: 'https://tokopedia.link/example1',
        waNumber: '628123456789'
    },
    {
        id: '2',
        name: 'Kain Batik Megamendung Sutra',
        description: 'Kain batik tulis Megamendung berbahan sutra eksklusif.',
        price: 1250000,
        type: 'Kain',
        motif: 'Megamendung',
        imageUrl: 'https://images.unsplash.com/photo-1614030638510-449eb724497c?auto=format&fit=crop&q=80&w=800',
        waNumber: '628123456789'
    },
    {
        id: '3',
        name: 'Dress Batik Sekar Jagad',
        description: 'Dress batik motif Sekar Jagad dengan sentuhan modern.',
        price: 675000,
        type: 'Dress',
        motif: 'Sekar Jagad',
        imageUrl: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=800',
        waNumber: '628123456789'
    },
    {
        id: '4',
        name: 'Outer Batik Kawung',
        description: 'Outerwear batik motif kawung yang kasual.',
        price: 325000,
        type: 'Outer',
        motif: 'Kawung',
        imageUrl: 'https://images.unsplash.com/photo-1620799139507-2a76f79a2f4d?auto=format&fit=crop&q=80&w=800',
        waNumber: '628123456789'
    }
];
