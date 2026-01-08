import re

# Read the HTML file
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Define replacements for broken images
replacements = {
    # Jewelry category
    'https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg?auto=compress&cs=tinysrgb&w=400': 'https://picsum.photos/seed/diamond-ring/400/600',
    'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=400': 'https://picsum.photos/seed/gold-bracelet/400/600',
    'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=400': 'https://picsum.photos/seed/pearl-earrings/400/600',
    'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=400&h=500': 'https://picsum.photos/seed/gold-hoops/400/600',
    
    # Pants category - all 14 broken images
    'https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=400&h=600': 'https://picsum.photos/seed/wide-leg-trousers/400/600',
    'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=400': 'https://picsum.photos/seed/indigo-jeans/400/600',
    'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=400&h=650': 'https://picsum.photos/seed/leather-leggings/400/600',
    'https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=400&h=550': 'https://picsum.photos/seed/pleated-culottes/400/600',
    'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=400&h=600': 'https://picsum.photos/seed/cargo-pants/400/600',
    'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=400&h=700': 'https://picsum.photos/seed/velvet-flares/400/600',
    'https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=400&h=650': 'https://picsum.photos/seed/linen-slacks/400/600',
    'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=400&h=650': 'https://picsum.photos/seed/plaid-trousers/400/600',
    'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=400&h=750': 'https://picsum.photos/seed/silk-pants/400/600',
    'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=400&h=700': 'https://picsum.photos/seed/mom-jeans/400/600',
    'https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=400&h=700': 'https://picsum.photos/seed/satin-joggers/400/600',
    'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=400&h=800': 'https://picsum.photos/seed/split-hem-leggings/400/600',
    'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=400&h=750': 'https://picsum.photos/seed/corduroy-trousers/400/600',
    'https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=400&h=750': 'https://picsum.photos/seed/paperbag-pants/400/600',
}

# Apply all replacements
for old_url, new_url in replacements.items():
    html = html.replace(old_url, new_url)

# Write back
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Fixed all broken images!")
