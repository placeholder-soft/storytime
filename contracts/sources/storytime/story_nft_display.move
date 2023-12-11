module storytime::story_nft_display {
    use sui::url::{Self, Url};
    use std::string::{utf8, String};
    use sui::object::{Self, ID, UID};
    use sui::event;
    use sui::transfer;
    use sui::tx_context::{Self, sender, TxContext};

    // The creator bundle: these two packages often go together.
    use sui::package;
    use sui::display;

    /// An example NFT that can be minted by anybody
    struct StoryNFT has key, store {
        id: UID,
        /// Name for the token
        name: String,
        /// URL for the token
        image_url: String,
    }

    // ===== Events =====

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
    struct STORY_NFT_DISPLAY has drop {}

    /// In the module initializer one claims the `Publisher` object
    /// to then create a `Display`. The `Display` is initialized with
    /// a set of fields (but can be modified later) and published via
    /// the `update_version` call.
    ///
    /// Keys and values are set in the initializer but could also be
    /// set after publishing if a `Publisher` object was created.
    fun init(otw: STORY_NFT_DISPLAY, ctx: &mut TxContext) {
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
            utf8(b"https://storytime.placeholdersoft.workers.dev/story/{id}"),
            // For `image_url` use an IPFS template + `image_url` property.
            utf8(b"https://storytime.placeholdersoft.workers.dev/images/{image_url}"),
            // Description is static for all `Hero` objects.
            utf8(b"A true Story of the Sui ecosystem!"),
            // Project URL is usually static
            utf8(b"https://storytime.placeholdersoft.workers.dev"),
            // Creator field can be any
            utf8(b"Unknown Sui Fan")
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

    public fun mint(name: String, image_url: String, ctx: &mut TxContext) {
        let sender = tx_context::sender(ctx);
        let id = object::new(ctx);
        let nft = StoryNFT { id, name, image_url };
        transfer::public_transfer(nft, sender);
    }

    /// Transfer `nft` to `recipient`
    public fun transfer(
        nft: StoryNFT, recipient: address, _: &mut TxContext
    ) {
        transfer::public_transfer(nft, recipient)
    }
}