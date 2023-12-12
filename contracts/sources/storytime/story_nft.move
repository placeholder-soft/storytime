module storytime::story_nft {
    use std::string::{utf8, String};
    use sui::object::{Self, ID, UID};
    use sui::transfer;
    use sui::tx_context::{Self, sender, TxContext};
    use sui::event;

    use sui::package;
    use sui::display;

    struct ChapterNFT has key, store {
        id: UID,
        chapter_number: u64,
        content: vector<u8> 
    }

    struct StoryNFT has key, store {
        id: UID,
        /// Name for the token
        name: String,
        /// URL for the token
        image_url: String,

        chapters: vector<ChapterNFT>,

        auther: address,
    }

    struct NFTMinted has copy, drop {
        // The Object ID of the NFT
        object_id: ID,
        // The creator of the NFT
        creator: address,
        // The name of the NFT
        name: String,
    }
    // ====
    /// One-Time-Witness for the module.
    struct STORY_NFT has drop {}

    fun init(otw: STORY_NFT, ctx: &mut TxContext) {
        let keys = vector[
            utf8(b"name"),
            utf8(b"link"),
            utf8(b"image_url"),
            utf8(b"description"),
            utf8(b"project_url"),
            utf8(b"creator"),
        ];

        let values = vector[
            // For `name` one can use the `Hero.name` property
            utf8(b"{name}"),
            // For `link` one can build a URL using an `id` property
            utf8(b"https://data.storytime.one/story/sui-{id}"),
            // For `image_url` use an IPFS template + `image_url` property.
            utf8(b"https://data.storytime.one/images/sui-{id}"),
            // Description is static for all `Hero` objects.
            utf8(b"A true Storytime of the Sui ecosystem!"),
            // Project URL is usually static
            utf8(b"https://app.storytime.one/sui-{id}"),
            // Creator field can be any
            utf8(b"Storytime"),
        ];

        // Claim the `Publisher` for the package!
        let publisher = package::claim(otw, ctx);

        // Get a new `Display` object for the `Hero` type.
        let display = display::new_with_fields<StoryNFT>(
            &publisher, keys, values, ctx
        );

        // Commit first version of `Display` to apply changes.
        display::update_version(&mut display);

        transfer::public_transfer(publisher, sender(ctx));
        transfer::public_transfer(display, sender(ctx));
    }

    // ===== Entrypoints =====
    #[lint_allow(self_transfer)]
    public fun mint(name: String, image_url: String, ctx: &mut TxContext) {
        let sender = tx_context::sender(ctx);
        let id = object::new(ctx);
        let chapters = vector[];
        let nft = StoryNFT { 
            id, 
            name, 
            image_url, 
            chapters, 
            auther: sender 
        };

        event::emit(NFTMinted {
            object_id: object::id(&nft),
            creator: sender,
            name: nft.name,
        });

        transfer::public_transfer(nft, sender);
    }

    public fun mint_to(to: address, name: String, image_url: String, ctx: &mut TxContext) {
        let id = object::new(ctx);
        let chapters = vector[];
        let nft = StoryNFT { 
            id, 
            name, 
            image_url, 
            chapters, 
            auther: to
        };

        event::emit(NFTMinted {
            object_id: object::id(&nft),
            creator: to,
            name: nft.name,
        });

        transfer::public_transfer(nft, to);
    }

    /// Transfer `nft` to `recipient`
    public fun transfer(
        nft: StoryNFT, recipient: address, _: &mut TxContext
    ) {
        transfer::public_transfer(nft, recipient)
    }
}

